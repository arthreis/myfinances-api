import { DataSource } from 'typeorm'

const dataSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'myfinances',
  logging: false,
  synchronize: false,
  name: 'default',
  entities: ['./src/modules/*/entities/*.ts'],
  migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
});
