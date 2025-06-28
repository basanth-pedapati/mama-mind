import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

// Validation schemas
const VitalsSchema = z.object({
  weight: z.number().positive().optional(),
  bloodPressure: z.object({
    systolic: z.number().min(70).max(200),
    diastolic: z.number().min(40).max(130),
  }).optional(),
  heartRate: z.number().min(50).max(200).optional(),
  temperature: z.number().min(95).max(105).optional(),
  oxygenSaturation: z.number().min(85).max(100).optional(),
  glucoseLevel: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

const KickCountSchema = z.object({
  count: z.number().min(0).max(50),
  duration: z.number().positive(), // in minutes
  notes: z.string().max(200).optional(),
});

const ContractionSchema = z.object({
  startTime: z.string(),
  duration: z.number().positive(), // in seconds
  intensity: z.enum(['mild', 'moderate', 'strong']),
  notes: z.string().max(200).optional(),
});

// Types
interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Vitals analysis function (placeholder for ML integration)
function analyzeVitals(vitals: any, userProfile: any) {
  const alerts = [];
  const gestationalWeek = userProfile.gestational_week || 20;

  // Blood pressure analysis
  if (vitals.bloodPressure) {
    const { systolic, diastolic } = vitals.bloodPressure;
    
    if (systolic >= 140 || diastolic >= 90) {
      alerts.push({
        type: 'critical',
        category: 'blood_pressure',
        message: 'High blood pressure detected. Please contact your healthcare provider immediately.',
        values: { systolic, diastolic },
      });
    } else if (systolic >= 130 || diastolic >= 85) {
      alerts.push({
        type: 'warning',
        category: 'blood_pressure',
        message: 'Elevated blood pressure. Monitor closely and consider contacting your healthcare provider.',
        values: { systolic, diastolic },
      });
    }
  }

  // Heart rate analysis
  if (vitals.heartRate) {
    if (vitals.heartRate < 60 || vitals.heartRate > 120) {
      alerts.push({
        type: vitals.heartRate < 50 || vitals.heartRate > 130 ? 'critical' : 'warning',
        category: 'heart_rate',
        message: `Heart rate of ${vitals.heartRate} BPM is outside normal range for pregnancy.`,
        values: { heartRate: vitals.heartRate },
      });
    }
  }

  // Weight analysis (simplified)
  if (vitals.weight && userProfile.baseline_weight) {
    const weightGain = vitals.weight - userProfile.baseline_weight;
    const expectedGain = gestationalWeek * 0.5; // Simplified calculation
    
    if (weightGain > expectedGain + 10) {
      alerts.push({
        type: 'warning',
        category: 'weight',
        message: 'Significant weight gain detected. Please discuss with your healthcare provider.',
        values: { currentWeight: vitals.weight, weightGain },
      });
    }
  }

  return {
    status: alerts.length === 0 ? 'normal' : alerts.some(a => a.type === 'critical') ? 'critical' : 'warning',
    alerts,
    riskScore: alerts.length * 0.2, // Simplified risk scoring
  };
}

export default async function vitalsRoutes(fastify: FastifyInstance) {
  // Authentication middleware
  const authenticate = async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded as any;
    } catch (error) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  };

  // Record vitals
  fastify.post('/', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const body = VitalsSchema.parse(request.body);
      
      // Get user profile for analysis
      const { data: userProfile } = await fastify.supabase
        .from('users')
        .select('*')
        .eq('id', request.user?.id)
        .single();

      // Analyze vitals
      const analysis = analyzeVitals(body, userProfile);

      // Store vitals record
      const { data: vitalsRecord, error } = await fastify.supabase
        .from('vitals')
        .insert({
          user_id: request.user?.id,
          weight: body.weight,
          blood_pressure_systolic: body.bloodPressure?.systolic,
          blood_pressure_diastolic: body.bloodPressure?.diastolic,
          heart_rate: body.heartRate,
          temperature: body.temperature,
          oxygen_saturation: body.oxygenSaturation,
          glucose_level: body.glucoseLevel,
          notes: body.notes,
          analysis_status: analysis.status,
          risk_score: analysis.riskScore,
          recorded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        fastify.log.error('Vitals recording error:', error);
        return reply.code(400).send({ error: 'Failed to record vitals' });
      }

      // Create alerts if any
      if (analysis.alerts.length > 0) {
        const alertInserts = analysis.alerts.map(alert => ({
          user_id: request.user?.id,
          vitals_id: vitalsRecord.id,
          type: alert.type,
          category: alert.category,
          message: alert.message,
          metadata: alert.values,
          created_at: new Date().toISOString(),
        }));

        await fastify.supabase
          .from('alerts')
          .insert(alertInserts);

        // Emit real-time alerts for critical cases
        if (analysis.alerts.some(a => a.type === 'critical')) {
          fastify.io.to(`user-${request.user?.id}`).emit('critical-alert', {
            message: 'Critical vitals detected. Please contact your healthcare provider immediately.',
            alerts: analysis.alerts.filter(a => a.type === 'critical'),
          });
        }
      }

      reply.code(201).send({
        message: 'Vitals recorded successfully',
        vitals: vitalsRecord,
        analysis,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Record vitals error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get vitals history
  fastify.get('/', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const querySchema = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      });

      const query = querySchema.parse(request.query);
      const offset = (query.page - 1) * query.limit;

      let queryBuilder = fastify.supabase
        .from('vitals')
        .select('*')
        .eq('user_id', request.user?.id)
        .order('recorded_at', { ascending: false });

      if (query.startDate) {
        queryBuilder = queryBuilder.gte('recorded_at', query.startDate);
      }
      if (query.endDate) {
        queryBuilder = queryBuilder.lte('recorded_at', query.endDate);
      }

      const { data: vitals, error, count } = await queryBuilder
        .range(offset, offset + query.limit - 1);

      if (error) {
        fastify.log.error('Get vitals error:', error);
        return reply.code(400).send({ error: 'Failed to retrieve vitals' });
      }

      reply.send({
        vitals,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / query.limit),
        },
      });

    } catch (error) {
      fastify.log.error('Get vitals history error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Record kick count
  fastify.post('/kicks', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const body = KickCountSchema.parse(request.body);

      const { data: kickCount, error } = await fastify.supabase
        .from('kick_counts')
        .insert({
          user_id: request.user?.id,
          count: body.count,
          duration: body.duration,
          notes: body.notes,
          recorded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        fastify.log.error('Kick count recording error:', error);
        return reply.code(400).send({ error: 'Failed to record kick count' });
      }

      // Analyze kick count (simplified)
      let analysis = { status: 'normal', message: 'Kick count recorded successfully' };
      
      if (body.count < 6 && body.duration >= 60) {
        analysis = {
          status: 'warning',
          message: 'Low fetal movement detected. Consider contacting your healthcare provider.',
        };

        // Create alert
        await fastify.supabase
          .from('alerts')
          .insert({
            user_id: request.user?.id,
            type: 'warning',
            category: 'fetal_movement',
            message: analysis.message,
            metadata: { kickCount: body.count, duration: body.duration },
            created_at: new Date().toISOString(),
          });
      }

      reply.code(201).send({
        message: analysis.message,
        kickCount,
        analysis,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Record kick count error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Record contraction
  fastify.post('/contractions', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const body = ContractionSchema.parse(request.body);

      const { data: contraction, error } = await fastify.supabase
        .from('contractions')
        .insert({
          user_id: request.user?.id,
          start_time: body.startTime,
          duration: body.duration,
          intensity: body.intensity,
          notes: body.notes,
          recorded_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        fastify.log.error('Contraction recording error:', error);
        return reply.code(400).send({ error: 'Failed to record contraction' });
      }

      // Get recent contractions for pattern analysis
      const { data: recentContractions } = await fastify.supabase
        .from('contractions')
        .select('*')
        .eq('user_id', request.user?.id)
        .gte('recorded_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()) // Last 2 hours
        .order('recorded_at', { ascending: false })
        .limit(10);

      let analysis = { status: 'normal', message: 'Contraction recorded successfully' };

      // Simple pattern analysis
      if (recentContractions && recentContractions.length >= 3) {
        const intervals = [];
        for (let i = 0; i < recentContractions.length - 1; i++) {
          const diff = new Date(recentContractions[i].recorded_at).getTime() - 
                      new Date(recentContractions[i + 1].recorded_at).getTime();
          intervals.push(diff / (1000 * 60)); // Convert to minutes
        }

        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        
        if (avgInterval < 10 && body.intensity === 'strong') {
          analysis = {
            status: 'critical',
            message: 'Regular strong contractions detected. This could indicate labor. Contact your healthcare provider immediately.',
          };

          await fastify.supabase
            .from('alerts')
            .insert({
              user_id: request.user?.id,
              type: 'critical',
              category: 'contractions',
              message: analysis.message,
              metadata: { avgInterval, intensity: body.intensity, count: recentContractions.length },
              created_at: new Date().toISOString(),
            });

          // Emit critical alert
          fastify.io.to(`user-${request.user?.id}`).emit('critical-alert', {
            message: analysis.message,
            type: 'contractions',
          });
        }
      }

      reply.code(201).send({
        message: analysis.message,
        contraction,
        analysis,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Record contraction error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get vitals summary/dashboard
  fastify.get('/summary', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Get recent vitals
      const { data: recentVitals } = await fastify.supabase
        .from('vitals')
        .select('*')
        .eq('user_id', request.user?.id)
        .gte('recorded_at', thirtyDaysAgo)
        .order('recorded_at', { ascending: false })
        .limit(30);

      // Get recent alerts
      const { data: recentAlerts } = await fastify.supabase
        .from('alerts')
        .select('*')
        .eq('user_id', request.user?.id)
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get kick counts summary
      const { data: kickCounts } = await fastify.supabase
        .from('kick_counts')
        .select('*')
        .eq('user_id', request.user?.id)
        .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      // Calculate trends and averages
      const trends = {
        weightTrend: recentVitals?.filter(v => v.weight).map(v => ({ date: v.recorded_at, value: v.weight })) || [],
        bpTrend: recentVitals?.filter(v => v.blood_pressure_systolic).map(v => ({ 
          date: v.recorded_at, 
          systolic: v.blood_pressure_systolic,
          diastolic: v.blood_pressure_diastolic 
        })) || [],
        averageKicksPerDay: kickCounts ? kickCounts.reduce((acc, k) => acc + k.count, 0) / Math.max(kickCounts.length, 1) : 0,
      };

      reply.send({
        summary: {
          totalVitalsRecords: recentVitals?.length || 0,
          activeAlerts: recentAlerts?.filter(a => a.type === 'critical').length || 0,
          lastRecording: recentVitals?.[0]?.recorded_at || null,
          riskLevel: recentVitals?.[0]?.analysis_status || 'normal',
        },
        trends,
        recentAlerts: recentAlerts?.slice(0, 5) || [],
      });

    } catch (error) {
      fastify.log.error('Get vitals summary error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
