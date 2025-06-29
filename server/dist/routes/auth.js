export default async function authRoutes(fastify) {
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', service: 'auth' };
    });
    fastify.post('/login', async (request, reply) => {
        return { message: 'Login endpoint - under development' };
    });
    fastify.post('/register', async (request, reply) => {
        return { message: 'Register endpoint - under development' };
    });
    fastify.post('/logout', async (request, reply) => {
        return { message: 'Logout endpoint - under development' };
    });
}
//# sourceMappingURL=auth.js.map