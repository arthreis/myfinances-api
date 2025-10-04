import request from 'supertest';
import { dataSource as ormconfigDatasource } from '../shared/infra/typeorm/config/datasources/ormconfig';

import app from '../app';

describe('User', () => {
  const testDataSource = ormconfigDatasource;
  console.log(`Iniciando a conexão com o banco de dados [${testDataSource.options.database}] para os testes...`);

  beforeAll(async () => {
    if (!testDataSource.isInitialized) {
      console.log('Conexão do TypeORM não estava inicializada. Inicializando agora...');
      await testDataSource.initialize();
    } else {
      console.log('Conexão do TypeORM já estava inicializada.');
    }

    await testDataSource.query(`
      SET session_replication_role = "replica";
      TRUNCATE TABLE "users", "categories", "transactions" RESTART IDENTITY;
      SET session_replication_role = "origin";
    `);
  });

  afterAll(async () => {
    await testDataSource.query(`
      SET session_replication_role = "replica";
      TRUNCATE TABLE "users", "categories", "transactions" RESTART IDENTITY;
      SET session_replication_role = "origin";
    `);

    if (testDataSource.isInitialized){
      console.log(`Fechando a conexão do banco de dados após os testes ...`);
      await testDataSource.destroy();
    } else {
      console.log('A conexão do banco de dados já estava fechada.');
    }
  });

  it('should be able to reject wrong login request', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'john@doe.com',
      password: 'teste123',
    });

    expect(response.status).toBe(401);
  });

  it('should be able to perform register', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'teste123',
    });

    expect(response.body).toMatchObject(
      expect.objectContaining({
        name: 'John Doe',
      }),
    );
  });

  it('should be able to perform login request', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'john@doe.com',
      password: 'teste123',
    });

    expect(response.body).toMatchObject(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
  });

  it('should be able to reject an duplicated email register request', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'teste123',
    });

    expect(response.status).toBe(400);
  });
});
