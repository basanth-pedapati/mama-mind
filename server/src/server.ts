import Fastify from 'fastify';
import cors from '@fastify/cors';
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
    // Register CORS with proper typing
    await server.register(cors as any, {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
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

    const port = parseInt(process.env.PORT || '3000', 10);

    server.listen({ port, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`🚀 Server running at ${address}`);
      console.log(`📊 Health check available at ${address}/health`);
    });
    
  } catch (error) {
    server.log.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
start();

export default server;
