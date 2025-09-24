import { DataSource } from 'typeorm';
import { dataSource as ormconfigDataSource } from './src/shared/infra/typeorm/config/datasources/ormconfig';

const databaseAdmin = process.env.POSTGRES_DB;
const databaseTest = process.env.DB_NAME;

const setup = async () => {
  console.log(`Iniciando o processo de setup do Jest no ambiente de [${process.env.NODE_ENV}] ...`);
  await recreateDatabaseTest();
  await runMigrations();
};

export default setup;

async function recreateDatabaseTest() {
  const adminDataSource = new DataSource(ormconfigDataSource.options);
  adminDataSource.setOptions({
    database: databaseAdmin,
  });

  try {
    console.log(`Conectando ao banco de dados [${databaseAdmin}] para tarefas administrativas ...`);
    await adminDataSource.initialize();
    console.log(`Conectado ao banco de dados [${databaseAdmin}] com sucesso.`);

    await adminDataSource.query(`SELECT pg_terminate_backend(pg_stat_activity.pid)
                                 FROM pg_stat_activity
                                 WHERE pg_stat_activity.datname = '${databaseTest}'
                                 AND pid <> pg_backend_pid();`);

    console.log(`Recriando o banco de dados [${databaseTest}] ...`);
    await adminDataSource.query(`DROP DATABASE IF EXISTS "${databaseTest}";`);

    await adminDataSource.query(`CREATE DATABASE "${databaseTest}";`);
    console.log(`Banco de dados [${databaseTest}] recriado com sucesso.`);

  } catch (error) {
    console.error(`Erro ao conectar/dropar o banco de dados [ADM: ${databaseAdmin} / TEST: ${databaseTest}]: `, error);
    process.exit(1);
  } finally {
    if (adminDataSource.isInitialized) {
      console.log('Fechando a conexão administrativa do banco de dados...');
      await adminDataSource.destroy();
      console.log('Conexão administrativa fechada com sucesso.');
      console.log('-------------------------------------------------------------');
    }
  }
}

async function runMigrations() {
  console.log(`Inicializando a conexão do TypeORM para migrações no banco de dados [${databaseTest}]...`);
  try {
    ormconfigDataSource.setOptions({
      database: databaseTest,
    });

    if (!ormconfigDataSource.isInitialized) {
      console.log('Conexão do TypeORM não estava inicializada. Inicializando agora...');
      await ormconfigDataSource.initialize();
    }

    console.log(`Executando as migrações no banco de dados [${ormconfigDataSource.options.database}] ...`);
    await ormconfigDataSource.runMigrations();
    console.log('Migrações aplicadas com sucesso.');

  } catch (err) {
    console.error('Erro ao rodar migrações do TypeORM:', err);
    process.exit(1);
  } finally {
    if (ormconfigDataSource.isInitialized) {
      console.log('Fechando a conexão do banco de dados após as migrações...');
      await ormconfigDataSource.destroy();
      console.log('Conexão fechada com sucesso.');
      console.log('-------------------------------------------------------------');
    }
  }
}
