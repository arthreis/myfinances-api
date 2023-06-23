// import { createConnection, getConnectionOptions, Connection } from 'typeorm';

import { dataSource } from './config/datasources/ormconfig';

// export default async (name = 'default'): Promise<Connection> => {
//   const defaultOptions = await getConnectionOptions();

//   return createConnection(
//     Object.assign(defaultOptions, {
//       name,
//       database:
//         process.env.NODE_ENV === 'test'
//           ? 'gostack_desafio06_tests'
//           : defaultOptions.database,
//     }),
//   );
// };

// import { Connection, createConnection } from 'typeorm';

// export default async (): Promise<Connection> =>
//   createConnection();


import { Connection } from 'typeorm';

export default async (): Promise<Connection> =>
  dataSource.initialize();
;
