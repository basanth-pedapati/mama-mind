import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export default async function alertsRoutes(fastify: FastifyInstance) {
  // Authentication middleware
  const authenticate = async (request: any, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded;
    } catch (error) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  };

  // Get user alerts
  fastify.get('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const querySchema = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(100).default(20),
        type: z.enum(['normal', 'warning', 'critical']).optional(),
        acknowledged: z.coerce.boolean().optional(),
      });

      const query = querySchema.parse(request.query);
      const offset = (query.page - 1) * query.limit;

      let queryBuilder = (fastify as any).supabase
        .from('alerts')
        .select('*')
        .eq('user_id', request.user?.id)
        .order('created_at', { ascending: false });

      if (query.type) {
        queryBuilder = queryBuilder.eq('type', query.type);
      }

      if (query.acknowledged !== undefined) {
        if (query.acknowledged) {
          queryBuilder = queryBuilder.not('acknowledged_at', 'is', null);
        } else {
          queryBuilder = queryBuilder.is('acknowledged_at', null);
        }
      }

      const { data: alerts, error, count } = await queryBuilder
        .range(offset, offset + query.limit - 1);

      if (error) {
        fastify.log.error('Get alerts error:', error);
        return reply.code(400).send({ error: 'Failed to retrieve alerts' });
      }

      reply.send({
        alerts,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / query.limit),
        },
      });

    } catch (error) {
      fastify.log.error('Get alerts error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Acknowledge alert
  fastify.patch('/:alertId/acknowledge', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const paramsSchema = z.object({
        alertId: z.string(),
      });

      const params = paramsSchema.parse(request.params);

      const { data: alert, error } = await (fastify as any).supabase
        .from('alerts')
        .update({ acknowledged_at: new Date().toISOString() })
        .eq('id', params.alertId)
        .eq('user_id', request.user?.id)
        .select()
        .single();

      if (error) {
        fastify.log.error('Acknowledge alert error:', error);
        return reply.code(400).send({ error: 'Failed to acknowledge alert' });
      }

      if (!alert) {
        return reply.code(404).send({ error: 'Alert not found' });
      }

      reply.send({
        message: 'Alert acknowledged successfully',
        alert,
      });

    } catch (error) {
      fastify.log.error('Acknowledge alert error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get alerts summary
  fastify.get('/summary', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const userId = request.user?.id;

      // Get unacknowledged alerts count by type
      const { data: unacknowledgedAlerts } = await (fastify as any).supabase
        .from('alerts')
        .select('type')
        .eq('user_id', userId)
        .is('acknowledged_at', null);

      // Get alerts from last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recentAlerts } = await (fastify as any).supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: false });

      const summary = {
        unacknowledged: {
          total: unacknowledgedAlerts?.length || 0,
          critical: unacknowledgedAlerts?.filter((a: any) => a.type === 'critical').length || 0,
          warning: unacknowledgedAlerts?.filter((a: any) => a.type === 'warning').length || 0,
          normal: unacknowledgedAlerts?.filter((a: any) => a.type === 'normal').length || 0,
        },
        recent: {
          total: recentAlerts?.length || 0,
          last7Days: recentAlerts || [],
        },
      };

      reply.send(summary);

    } catch (error) {
      fastify.log.error('Get alerts summary error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Create manual alert (for testing or admin use)
  fastify.post('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const alertSchema = z.object({
        type: z.enum(['normal', 'warning', 'critical']),
        category: z.string(),
        message: z.string().min(1).max(500),
        metadata: z.record(z.any()).optional(),
      });

      const body = alertSchema.parse(request.body);

      const { data: alert, error } = await (fastify as any).supabase
        .from('alerts')
        .insert({
          user_id: request.user?.id,
          type: body.type,
          category: body.category,
          message: body.message,
          metadata: body.metadata,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        fastify.log.error('Create alert error:', error);
        return reply.code(400).send({ error: 'Failed to create alert' });
      }

      // Emit real-time alert
      (fastify as any).io.to(`user-${request.user?.id}`).emit('new-alert', alert);

      reply.code(201).send({
        message: 'Alert created successfully',
        alert,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Create alert error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // WebSocket endpoint for real-time alerts
  fastify.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection, request) => {
      // Join user-specific room
      const userId = (request as any).user?.id;
      if (userId) {
        connection.socket.join(`user-${userId}`);
        fastify.log.info(`User ${userId} connected to alerts WebSocket`);
      }

      connection.socket.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'ping') {
            connection.socket.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          }
        } catch (error) {
          fastify.log.warn('Invalid WebSocket message:', error);
        }
      });

      connection.socket.on('close', () => {
        fastify.log.info(`User ${userId} disconnected from alerts WebSocket`);
      });
    });
  });
}
