import Fastify from 'fastify';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import vitalsRoutes from './routes/vitals';
import chatRoutes from './routes/chat';
import alertsRoutes from './routes/alerts';
import uploadRoutes from './routes/upload';
import analyticsRoutes from './routes/analytics';
dotenv.config();
const server = Fastify({
    logger: true
});
async function start() {
    try {
        server.addHook('onRequest', async (request, reply) => {
            reply.header('Access-Control-Allow-Origin', 'http://localhost:3000');
            reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            reply.header('Access-Control-Allow-Credentials', 'true');
            if (request.method === 'OPTIONS') {
                reply.status(200).send();
            }
        });
        server.get('/health', async () => {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                service: 'mama-mind-server'
            };
        });
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
    }
    catch (error) {
        server.log.error('Error starting server:', error);
        process.exit(1);
    }
}
start();
export default server;
//# sourceMappingURL=server-working.js.map