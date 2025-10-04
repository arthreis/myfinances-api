import { dataSource } from './config/datasources/ormconfig';

import { type DataSource } from 'typeorm';

export default async (): Promise<DataSource> =>
  dataSource.initialize();
;
