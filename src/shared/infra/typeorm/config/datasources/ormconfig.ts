import { DataSource } from 'typeorm';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../../../../env/index.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dataSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  logging: env.DB_LOG === 'true',
  ssl: env.DB_SSL === 'true',
  synchronize: env.DB_SYNCHRONIZE === 'true',
  name: 'default',
  migrations: [join(__dirname, '../../migrations/*.ts')], // ESM-safe
  entities: [join(__dirname, '../../../../modules/*/entities/*.ts')], // Ajuste de path relativo
});
