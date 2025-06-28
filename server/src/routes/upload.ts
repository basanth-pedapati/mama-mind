import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function uploadRoutes(fastify: FastifyInstance) {
  // Health check for upload routes
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', service: 'upload' };
  });

  // Upload file endpoint
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Upload endpoint - under development' };
  });

  // Get uploaded files
  fastify.get('/files', async (request: FastifyRequest, reply: FastifyReply) => {
    return { files: [], message: 'File listing - under development' };
  });

  // Delete file
  fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'File deletion - under development' };
  });
}