import { dataSource } from './config/datasources/ormconfig.js';

import { type DataSource } from 'typeorm';

export default async (): Promise<DataSource> =>
  dataSource.initialize();
;
