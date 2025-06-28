import Fastify from 'fastify';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import vitalsRoutes from './routes/vitals.js';
import chatRoutes from './routes/chat.js';
import alertsRoutes from './routes/alerts.js';
import uploadRoutes from './routes/upload.js';
import analyticsRoutes from './routes/analytics.js';

// Load environment variables
dotenv.config();

const server = Fastify({
  logger: true
});

async function start() {
  try {
    // Simple CORS handling without plugin
    server.addHook('onRequest', async (request, reply) => {
      reply.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      reply.header('Access-Control-Allow-Credentials', 'true');
      
      if (request.method === 'OPTIONS') {
        reply.status(200).send();
      }
    });

    // Health check endpoint
    server.get('/health', async () => {
      return { 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'mama-mind-server'
      };
    });

    // API Info endpoint
    server.get('/', async () => {
      return {
        name: 'Mama Mind API',
        version: '1.0.0',
        description: 'Simple Fastify backend server for Mama Mind',
        endpoints: {
          health: '/health',
          auth: '/api/auth',
          vitals: '/api/vitals',
          chat: '/api/chat',
          alerts: '/api/alerts',
          upload: '/api/upload',
          analytics: '/api/analytics'
        }
      };
    });

    // Register API routes
    await server.register(authRoutes, { prefix: '/api/auth' });
    await server.register(vitalsRoutes, { prefix: '/api/vitals' });
    await server.register(chatRoutes, { prefix: '/api/chat' });
    await server.register(alertsRoutes, { prefix: '/api/alerts' });
    await server.register(uploadRoutes, { prefix: '/api/upload' });
    await server.register(analyticsRoutes, { prefix: '/api/analytics' });

    const host = process.env.HOST || 'localhost';
    const port = parseInt(process.env.PORT || '3001');
    
    await server.listen({ host, port });
    server.log.info(`🚀 Mama Mind Server running at http://${host}:${port}`);
    server.log.info(`📊 Health check available at http://${host}:${port}/health`);
    
  } catch (error) {
    server.log.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
start();

export default server;
