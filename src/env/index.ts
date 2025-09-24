import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

function getEnvFile(nodeEnv?: string): string {
  switch (nodeEnv) {
    case 'production':
      return '.env.production';
    case 'test':
      return '.env.test';
    case 'development':
      return '.env.development';
    default:
      return '.env';
  }
}

const envFile = getEnvFile(process.env.NODE_ENV);

console.log(`Carregando variáveis de ambiente do arquivo: ${envFile}`);

dotenv.config({
  path: resolve(__dirname, '..', '..', envFile),
});

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),

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
  _env.error.issues.forEach(issue => {
    console.error(`❌ Environment variable ${String(issue.path[0])}: ${issue.message}`);
  });
  throw new Error('Invalid environment variables')
}

export const env = _env.data
