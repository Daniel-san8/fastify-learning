import { FastifyReply, FastifyRequest } from 'fastify';

export async function checkSessionIDExists(
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (!req.cookies.sessionId) {
    reply.status(401).send({
      error: 'Unauthorized',
    });
  }
}
