import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  APP_PORT: z.coerce.number().default(3333),
  APP_NAME: z.string().nonempty(),

  AUTH_JWT_SECRET: z.string().nonempty(),
  AUTH_JWT_EXPIRES_IN: z.coerce.number(),

  DB_HOST: z.string().nonempty(),
  DB_PORT: z.coerce.number(),
  DB_USER: z.string().nonempty(),
  DB_PASS: z.string().nonempty(),
  DB_NAME: z.string().nonempty(),
  DB_LOG: z.string().nonempty(),
  DB_SSL: z.string().nonempty(),
  DB_SYNCHRONIZE: z.string().nonempty(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', z.treeifyError(_env.error));

  throw new Error('Invalid environment variables')

}

export const env = _env.data
