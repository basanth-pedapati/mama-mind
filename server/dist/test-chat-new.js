import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();
const server = Fastify({
    logger: true
});
async function start() {
    try {
        console.log('Testing chat routes import...');
        const chatModule = await import('./routes/chat.js');
        console.log('Chat module:', chatModule);
        console.log('Chat module default:', chatModule.default);
        console.log('Type of default:', typeof chatModule.default);
        if (typeof chatModule.default === 'function') {
            await server.register(chatModule.default, { prefix: '/api/chat-test' });
            console.log('✅ Chat-test routes registered successfully');
        }
        else {
            console.log('❌ chatModule.default is not a function');
        }
        server.get('/health', async () => {
            return { status: 'ok', timestamp: new Date().toISOString() };
        });
        const port = 3003;
        await server.listen({ port, host: 'localhost' });
        console.log(`🚀 Test server running at http://localhost:${port}`);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=test-chat-new.js.map