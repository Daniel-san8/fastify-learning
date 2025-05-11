import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../routes/app';
import { execSync } from 'node:child_process';

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all');
    execSync('npm run knex migrate:latest');
  });

  it('user can create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 49871,
        typePayment: 'debit',
      })
      .expect(201);
  });

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 49871,
        typePayment: 'debit',
      });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies || [])
      .expect(200);

    const id = listTransactionsResponse.body.transactions[0].id;
    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies || [])
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: -49871,
        id: expect.any(String),
        session_id: expect.any(String),
        created_at: expect.any(String),
      }),
    ]);
  });
});
