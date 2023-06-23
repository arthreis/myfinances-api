import { DataSource } from 'typeorm';
import path from 'path';
import User from '../../../../../modules/users/entities/User';
import Category from '../../../../../modules/categories/entities/Category';
import Transaction from '../../../../../modules/transactions/entities/Transaction';

export const dataSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: process.env.DB_HOST || '192.168.0.101',
  port: parseInt(process.env.DB_PORT!) || 5432,
  username: 'postgres',
  password: 'docker',
  database: 'myfinances',
  logging: false,
  synchronize: false,
  name: 'default',
  migrations: [path.join(__dirname, '../../migrations/*.ts')],
  entities: [User, Category, Transaction]
  // entities: [path.join(__dirname, '../../../../../modules/*/entities/*.ts')],
  // entities2: ['../../../../../modules/*/entities/*.ts'],
  // migrations2: ['../../migrations/*.ts'],
  // entities2: ['src/modules/*/entities/*.ts'],
  // migrations2: ['src/shared/infra/typeorm/migrations/*.ts'],
});
