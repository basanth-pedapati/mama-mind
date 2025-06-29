export default async function uploadRoutes(fastify) {
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', service: 'upload' };
    });
    fastify.post('/', async (request, reply) => {
        return { message: 'Upload endpoint - under development' };
    });
    fastify.get('/files', async (request, reply) => {
        return { files: [], message: 'File listing - under development' };
    });
    fastify.delete('/:id', async (request, reply) => {
        return { message: 'File deletion - under development' };
    });
}
//# sourceMappingURL=upload.js.map