import { DataSource } from 'typeorm';
import { join } from 'path';
import { env } from '../../../../../env';

const migrationsPath = join(__dirname, '../../migrations/*{.ts,.js}');
const entitiesPath = join(__dirname, '../../../../../modules/**/entities/*{.ts,.js}');

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
  migrations: [migrationsPath],
  entities: [entitiesPath],
});
