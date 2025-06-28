import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const server = Fastify({
  logger: true
});

async function start() {
  try {
    // Test importing chat routes
    console.log('Testing chat routes import...');
    const chatModule = await import('./routes/chat.js');
    console.log('Chat module:', chatModule);
    console.log('Chat module default:', chatModule.default);
    console.log('Type of default:', typeof chatModule.default);
    
    // Try to register it
    if (typeof chatModule.default === 'function') {
      await server.register(chatModule.default, { prefix: '/api/chat' });
      console.log('✅ Chat routes registered successfully');
    } else {
      console.log('❌ chatModule.default is not a function');
    }

    // Health check endpoint
    server.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    const port = 3002;
    await server.listen({ port, host: 'localhost' });
    console.log(`🚀 Test server running at http://localhost:${port}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

start();
