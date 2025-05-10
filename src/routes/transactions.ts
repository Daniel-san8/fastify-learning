import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { checkSessionIDExists } from '../middleware/check-session-id-exist';
import { knex } from './database';

export default async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIDExists],
    },
    async (req, reply) => {
      const transactions = await knex('transactions')
        .select('*')
        .where('session_id', req.cookies.sessionId)
        .returning('*');
      return reply.status(200).send({
        transactions,
        message: 'Transações listadas',
      });
    }
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIDExists],
    },
    async (req, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getTransactionParamsSchema.parse(req.params);

      const transactionId = await knex('transactions')
        .where({
          id,
          session_id: req.cookies.sessionId,
        })
        .first();

      return reply.status(200).send({
        transactionId,
        message: 'Transação retornada',
      });
    }
  );

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      typePayment: z.enum(['credit', 'debit']),
    });
    const { title, amount, typePayment } = createTransactionBodySchema.parse(
      req.body
    );

    let session_id = req.cookies.sessionId;

    if (!session_id) {
      session_id = randomUUID();

      reply.cookie('sessionId', session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: typePayment === 'credit' ? amount : amount * -1,
      session_id,
    });
    return reply.status(201).send({
      message: 'Transação executada com sucesso!',
    });
  });

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIDExists],
    },
    async (req, reply) => {
      const summary = await knex('transactions')
        .where({
          session_id: req.cookies.sessionId,
        })
        .sum('amount', {
          as: 'amount',
        });

      return reply.status(200).send({
        summary,
        message: 'Sumário retornado com sucesso!',
      });
    }
  );
}
