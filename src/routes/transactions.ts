import { FastifyInstance } from 'fastify';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';

export default async function transactionsRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    // const transactions = await knex('transactions')
    //   .insert({
    //     id: randomUUID(),
    //     title: 'Transação de teste',
    //     amount: 1000,
    //   })
    //   .returning('*');
    // return transactions;

    const transactions = knex('transactions').select('*').where('amount', 1000);
    return transactions;
  });
}
