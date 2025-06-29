import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import vitalsRoutes from './routes/vitals.js';
import chatRoutes from './routes/chat.js';
import alertsRoutes from './routes/alerts.js';
import uploadRoutes from './routes/upload.js';
import analyticsRoutes from './routes/analytics.js';
dotenv.config();
const server = Fastify({
    logger: true
});
async function start() {
    try {
        await server.register(cors, {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
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
        const port = parseInt(process.env.PORT || '3000', 10);
        server.listen({ port, host: '0.0.0.0' }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`🚀 Server running at ${address}`);
            console.log(`📊 Health check available at ${address}/health`);
        });
    }
    catch (error) {
        server.log.error('Error starting server:', error);
        process.exit(1);
    }
}
start();
export default server;
//# sourceMappingURL=server.js.map