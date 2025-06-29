import Fastify from 'fastify';
const server = Fastify({
    logger: true
});
async function start() {
    try {
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
                message: 'Server is running!'
            };
        });
        const host = '0.0.0.0';
        const port = 3001;
        await server.listen({ host, port });
        console.log(`🚀 Server running at http://${host}:${port}`);
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server-minimal.js.map