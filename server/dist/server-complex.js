import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { createClient } from '@supabase/supabase-js';
import { Server } from 'socket.io';
import { createClient as createRedisClient } from 'redis';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import vitalsRoutes from './routes/vitals';
import chatRoutes from './routes/chat';
import alertsRoutes from './routes/alerts';
import uploadRoutes from './routes/upload';
dotenv.config();
const server = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: process.env.NODE_ENV === 'development' ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        } : undefined,
    },
});
let supabase = null;
let redisClient = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
if (process.env.REDIS_URL) {
    redisClient = createRedisClient({
        url: process.env.REDIS_URL,
    });
}
async function buildServer() {
    try {
        await server.register(cors, {
            origin: (origin, callback) => {
                const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'), false);
                }
            },
            credentials: true,
        });
        const jwtSecret = process.env.JWT_SECRET || 'development-fallback-secret-key';
        await server.register(jwt, {
            secret: jwtSecret,
            sign: {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d',
            },
        });
        await server.register(rateLimit, {
            max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
            timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
        });
        await server.register(multipart, {
            limits: {
                fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
            },
        });
        await server.register(websocket);
        server.get('/health', async (request, reply) => {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                environment: process.env.NODE_ENV || 'development'
            };
        });
        server.get('/', async (request, reply) => {
            return {
                name: 'Mama Mind API',
                version: '1.0.0',
                description: 'Fastify backend server for Mama Mind maternity care app',
                endpoints: {
                    health: '/health',
                    auth: '/api/auth',
                    vitals: '/api/vitals',
                    chat: '/api/chat',
                    alerts: '/api/alerts',
                    upload: '/api/upload'
                }
            };
        });
        await server.register(authRoutes, { prefix: '/api/auth' });
        await server.register(vitalsRoutes, { prefix: '/api/vitals' });
        await server.register(chatRoutes, { prefix: '/api/chat' });
        await server.register(alertsRoutes, { prefix: '/api/alerts' });
        await server.register(uploadRoutes, { prefix: '/api/upload' });
        const io = new Server(server.server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        io.on('connection', (socket) => {
            server.log.info(`Client connected: ${socket.id}`);
            socket.on('join-room', (roomId) => {
                socket.join(roomId);
                server.log.info(`Client ${socket.id} joined room: ${roomId}`);
            });
            socket.on('leave-room', (roomId) => {
                socket.leave(roomId);
                server.log.info(`Client ${socket.id} left room: ${roomId}`);
            });
            socket.on('disconnect', () => {
                server.log.info(`Client disconnected: ${socket.id}`);
            });
        });
        server.decorate('io', io);
        server.decorate('supabase', supabase);
        server.decorate('redis', redisClient);
        return server;
    }
    catch (error) {
        server.log.error('Error building server:', error);
        throw error;
    }
}
async function start() {
    try {
        const app = await buildServer();
        if (redisClient) {
            try {
                await redisClient.connect();
                server.log.info('Connected to Redis');
            }
            catch (redisError) {
                server.log.warn('Redis connection failed, continuing without Redis:', redisError);
            }
        }
        const host = process.env.HOST || 'localhost';
        const port = parseInt(process.env.PORT || '3001');
        await app.listen({ host, port });
        server.log.info(`🚀 Mama Mind Server running at http://${host}:${port}`);
        server.log.info(`📊 Health check available at http://${host}:${port}/health`);
        server.log.info(`📡 Socket.IO server running on port ${port}`);
    }
    catch (error) {
        server.log.error('Error starting server:', error);
        process.exit(1);
    }
}
async function gracefulShutdown() {
    try {
        server.log.info('Starting graceful shutdown...');
        if (redisClient) {
            await redisClient.quit();
        }
        await server.close();
        server.log.info('Server shut down successfully');
        process.exit(0);
    }
    catch (error) {
        server.log.error('Error during shutdown:', error);
        process.exit(1);
    }
}
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('uncaughtException', (error) => {
    server.log.error('Uncaught Exception:', error);
    gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
    server.log.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});
if (require.main === module) {
    start();
}
export { buildServer, start };
export default server;
//# sourceMappingURL=server-complex.js.map