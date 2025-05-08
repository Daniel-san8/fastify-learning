import fastify from 'fastify';
import { knex } from './database';
import { randomUUID } from 'node:crypto';

const app = fastify();

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

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('HTTP SERVER RUNNING'));
