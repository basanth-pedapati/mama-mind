import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import OpenAI from 'openai';

// Initialize OpenAI conditionally
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }
  return openai;
}

// Validation schemas
const ChatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  context: z.object({
    gestationalWeek: z.number().optional(),
    recentSymptoms: z.array(z.string()).optional(),
    urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  }).optional(),
});

// System prompt for Mama Mind AI
const SYSTEM_PROMPT = `You are Mama Mind AI, a helpful and empathetic assistant specializing in maternity care and pregnancy support. 

IMPORTANT GUIDELINES:
- Always prioritize safety and recommend consulting healthcare providers for serious concerns
- Provide supportive, evidence-based information about pregnancy
- Never provide specific medical diagnoses or replace professional medical advice
- Be empathetic and understanding of pregnancy concerns
- If symptoms suggest emergency (severe bleeding, severe pain, difficulty breathing), immediately advise contacting emergency services
- Keep responses concise but informative
- Always encourage regular prenatal care

You help with:
- General pregnancy information and education
- Symptom tracking and understanding
- Wellness tips and lifestyle advice
- When to contact healthcare providers
- Emotional support during pregnancy`;

export default async function chatRoutes(fastify: FastifyInstance) {
  // Authentication middleware (simplified)
  const authenticate = async (request: any, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded;
    } catch (error) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  };

  // Chat endpoint
  fastify.post('/', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const body = ChatMessageSchema.parse(request.body);
      const userId = request.user?.id;

      // Generate cache key for similar queries
      const cacheKey = `chat:${userId}:${Buffer.from(body.message).toString('base64')}`;
      
      // Check Redis cache first
      let cachedResponse;
      try {
        cachedResponse = await (fastify as any).redis.get(cacheKey);
      } catch (redisError) {
        fastify.log.warn('Redis cache unavailable:', redisError);
      }

      if (cachedResponse) {
        return reply.send({
          message: JSON.parse(cachedResponse),
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }

      // Get user context for personalized responses
      const { data: userProfile } = await (fastify as any).supabase
        .from('users')
        .select('gestational_week, due_date, medical_history')
        .eq('id', userId)
        .single();

      // Get recent vitals for context
      const { data: recentVitals } = await (fastify as any).supabase
        .from('vitals')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(3);

      // Build context for AI
      let contextualInfo = '';
      if (userProfile?.gestational_week) {
        contextualInfo += `Current gestational week: ${userProfile.gestational_week}. `;
      }
      if (userProfile?.due_date) {
        const dueDate = new Date(userProfile.due_date);
        const now = new Date();
        const weeksRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));
        if (weeksRemaining > 0) {
          contextualInfo += `Approximately ${weeksRemaining} weeks until due date. `;
        }
      }

      // Add recent vitals context if available
      if (recentVitals && recentVitals.length > 0) {
        const latest = recentVitals[0];
        if (latest.analysis_status === 'warning' || latest.analysis_status === 'critical') {
          contextualInfo += `Recent vitals show ${latest.analysis_status} status. `;
        }
      }

      // Prepare messages for OpenAI
      const messages = [
        {
          role: 'system' as const,
          content: SYSTEM_PROMPT + (contextualInfo ? `\n\nCurrent patient context: ${contextualInfo}` : ''),
        },
        {
          role: 'user' as const,
          content: body.message,
        },
      ];

      // Check if OpenAI is configured
      if (!process.env.OPENAI_API_KEY) {
        return reply.send({
          message: {
            content: 'I apologize, but the AI chat service is not configured. Please contact your healthcare provider for assistance.',
            triageLevel: 'routine',
          },
          cached: false,
          timestamp: new Date().toISOString(),
        });
      }

      // Call OpenAI API
      const completion = await getOpenAIClient().chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Please try again or contact your healthcare provider if this is urgent.';

      // Analyze response for urgency and triage
      const urgencyKeywords = {
        emergency: ['emergency', 'call 911', 'severe bleeding', 'severe pain', 'difficulty breathing', 'loss of consciousness'],
        urgent: ['contact your doctor', 'call your healthcare provider', 'seek medical attention', 'concerning'],
        routine: ['normal', 'common', 'typical', 'monitor'],
      };

      let triageLevel = 'routine';
      const responseText = aiResponse.toLowerCase();
      
      if (urgencyKeywords.emergency.some(keyword => responseText.includes(keyword))) {
        triageLevel = 'emergency';
      } else if (urgencyKeywords.urgent.some(keyword => responseText.includes(keyword))) {
        triageLevel = 'urgent';
      }

      // Store conversation in database
      const { data: conversation, error } = await (fastify as any).supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          user_message: body.message,
          ai_response: aiResponse,
          triage_level: triageLevel,
          context: {
            gestationalWeek: userProfile?.gestational_week,
            ...body.context,
          },
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        fastify.log.warn('Failed to save conversation:', error);
      }

      // Cache the response for similar queries (5 minutes)
      try {
        await (fastify as any).redis.setex(cacheKey, 300, JSON.stringify({
          content: aiResponse,
          triageLevel,
        }));
      } catch (redisError) {
        fastify.log.warn('Failed to cache response:', redisError);
      }

      // Create alert if emergency or urgent
      if (triageLevel === 'emergency' || triageLevel === 'urgent') {
        await (fastify as any).supabase
          .from('alerts')
          .insert({
            user_id: userId,
            type: triageLevel === 'emergency' ? 'critical' : 'warning',
            category: 'ai_triage',
            message: `AI chat detected ${triageLevel} concern: ${body.message.substring(0, 100)}...`,
            metadata: { conversationId: conversation?.id, triageLevel },
            created_at: new Date().toISOString(),
          });

        // Emit real-time alert for emergency
        if (triageLevel === 'emergency') {
          (fastify as any).io.to(`user-${userId}`).emit('emergency-alert', {
            message: 'Emergency concern detected in chat. Please seek immediate medical attention.',
            conversationId: conversation?.id,
          });
        }
      }

      reply.send({
        message: {
          content: aiResponse,
          triageLevel,
          conversationId: conversation?.id,
        },
        cached: false,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      
      fastify.log.error('Chat error:', error);
      
      // Fallback response
      reply.code(500).send({
        message: {
          content: 'I apologize, but I\'m experiencing technical difficulties. If you have urgent concerns, please contact your healthcare provider immediately.',
          triageLevel: 'urgent',
        },
        error: 'Internal server error',
      });
    }
  });

  // Get chat history
  fastify.get('/history', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const querySchema = z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(20),
      });

      const query = querySchema.parse(request.query);
      const offset = (query.page - 1) * query.limit;

      const { data: conversations, error, count } = await (fastify as any).supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', request.user?.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + query.limit - 1);

      if (error) {
        fastify.log.error('Get chat history error:', error);
        return reply.code(400).send({ error: 'Failed to retrieve chat history' });
      }

      reply.send({
        conversations,
        pagination: {
          page: query.page,
          limit: query.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / query.limit),
        },
      });

    } catch (error) {
      fastify.log.error('Chat history error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get triage summary
  fastify.get('/triage-summary', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data: triageStats } = await (fastify as any).supabase
        .from('chat_conversations')
        .select('triage_level')
        .eq('user_id', request.user?.id)
        .gte('created_at', sevenDaysAgo);

      const summary = {
        total: triageStats?.length || 0,
        routine: triageStats?.filter(t => t.triage_level === 'routine').length || 0,
        urgent: triageStats?.filter(t => t.triage_level === 'urgent').length || 0,
        emergency: triageStats?.filter(t => t.triage_level === 'emergency').length || 0,
      };

      reply.send({ summary, period: '7 days' });

    } catch (error) {
      fastify.log.error('Triage summary error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Feedback endpoint for improving AI responses
  fastify.post('/feedback', { preHandler: authenticate }, async (request: any, reply: FastifyReply) => {
    try {
      const feedbackSchema = z.object({
        conversationId: z.string(),
        rating: z.number().min(1).max(5),
        helpful: z.boolean(),
        comments: z.string().max(500).optional(),
      });

      const body = feedbackSchema.parse(request.body);

      const { error } = await (fastify as any).supabase
        .from('chat_feedback')
        .insert({
          conversation_id: body.conversationId,
          user_id: request.user?.id,
          rating: body.rating,
          helpful: body.helpful,
          comments: body.comments,
          created_at: new Date().toISOString(),
        });

      if (error) {
        fastify.log.error('Feedback submission error:', error);
        return reply.code(400).send({ error: 'Failed to submit feedback' });
      }

      reply.send({ message: 'Feedback submitted successfully' });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Chat feedback error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
