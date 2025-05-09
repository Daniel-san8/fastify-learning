import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';

export default async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = knex('transactions').select('*').returning('*');
    return transactions;
  });

  app.post('/', async (req, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      typePayment: z.enum(['credit', 'debit']),
    });
    const { title, amount, typePayment } = createTransactionBodySchema.parse(
      req.body
    );

    const response = await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: typePayment === 'credit' ? amount : amount * -1,
    });
    return reply.status(201).send({
      message: 'Transação executada com sucesso!',
    });
  });
}
