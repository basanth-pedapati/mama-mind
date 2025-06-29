export default async function chatRoutes(fastify) {
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', service: 'chat' };
    });
    fastify.post('/message', async (request, reply) => {
        return { message: 'Chat endpoint - under development' };
    });
    fastify.get('/history', async (request, reply) => {
        return { messages: [], message: 'Chat history - under development' };
    });
}
//# sourceMappingURL=chat-new.js.map