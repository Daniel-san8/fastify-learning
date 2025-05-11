import { config } from 'dotenv';
import { z } from 'zod';

config({ path: '.env' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('ERRO NOS ENV', _env.error.format());
  throw new Error('INVALID ENVIROMENT VARIABLES');
}

export const env = _env.data;
