import Fastify from 'fastify';
import dotenv from 'dotenv';

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
        service: 'mama-mind-server-debug'
      };
    });

    // API Info endpoint
    server.get('/', async () => {
      return {
        name: 'Mama Mind API Debug',
        version: '1.0.0',
        description: 'Debug Fastify backend server for Mama Mind',
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

    console.log('✅ Basic routes registered');

    // Try to import and register auth routes first
    try {
      const authRoutes = await import('./routes/auth');
      await server.register(authRoutes.default, { prefix: '/api/auth' });
      console.log('✅ Auth routes registered');
    } catch (error) {
      console.error('❌ Error registering auth routes:', error);
      throw error;
    }

    // Try vitals routes
    try {
      const vitalsRoutes = await import('./routes/vitals');
      await server.register(vitalsRoutes.default, { prefix: '/api/vitals' });
      console.log('✅ Vitals routes registered');
    } catch (error) {
      console.error('❌ Error registering vitals routes:', error);
      throw error;
    }

    // Try chat routes
    try {
      const chatRoutes = await import('./routes/chat');
      await server.register(chatRoutes.default, { prefix: '/api/chat' });
      console.log('✅ Chat routes registered');
    } catch (error) {
      console.error('❌ Error registering chat routes:', error);
      throw error;
    }

    // Try alerts routes
    try {
      const alertsRoutes = await import('./routes/alerts');
      await server.register(alertsRoutes.default, { prefix: '/api/alerts' });
      console.log('✅ Alerts routes registered');
    } catch (error) {
      console.error('❌ Error registering alerts routes:', error);
      throw error;
    }

    // Try upload routes
    try {
      const uploadRoutes = await import('./routes/upload');
      await server.register(uploadRoutes.default, { prefix: '/api/upload' });
      console.log('✅ Upload routes registered');
    } catch (error) {
      console.error('❌ Error registering upload routes:', error);
      throw error;
    }

    // Try analytics routes
    try {
      const analyticsRoutes = await import('./routes/analytics');
      await server.register(analyticsRoutes.default, { prefix: '/api/analytics' });
      console.log('✅ Analytics routes registered');
    } catch (error) {
      console.error('❌ Error registering analytics routes:', error);
      throw error;
    }

    const host = process.env.HOST || 'localhost';
    const port = parseInt(process.env.PORT || '3001');
    
    await server.listen({ host, port });
    server.log.info(`🚀 Mama Mind Debug Server running at http://${host}:${port}`);
    server.log.info(`📊 Health check available at http://${host}:${port}/health`);
    
  } catch (error) {
    console.error('❌ Detailed error starting server:', error);
    server.log.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
start();

export default server;
