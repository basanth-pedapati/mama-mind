import { FastifyInstance } from 'fastify';
declare const server: FastifyInstance;
declare function buildServer(): Promise<FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>;
declare function start(): Promise<void>;
export { buildServer, start };
export default server;
//# sourceMappingURL=server-complex.d.ts.map