import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';

export default async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = knex('transactions').select('*').returning('*');
    return transactions;
  });

  app.post('/', async () => {
    const response = await knex('transactions')
      .insert({
        id: randomUUID(),
        title: 'new transaction',
        amount: 5984,
      })
      .returning('*');
    return response;
  });
}
