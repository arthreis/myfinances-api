import request from 'supertest';
import { hash } from 'bcrypt';
import { dataSource as ormconfigDataSource } from '../shared/infra/typeorm/config/datasources/ormconfig';
import Category from '../modules/categories/entities/Category';
import app from '../app';

let token: string;

describe('Categories', () => {
  const testDataSource = ormconfigDataSource;
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

    await testDataSource.query(
      `INSERT INTO users (name, email, password) VALUES ('test', 'teste@teste.com', $1)`,
      [await hash('teste123', 8)],
    );

    const loginResponse = await request(app).post('/sessions').send({
      email: 'teste@teste.com',
      password: 'teste123',
    });

    token = loginResponse.body.token;
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

  it('should be able to create a category', async () => {
    const categoryRepository = testDataSource.getRepository(Category);

    const response = await request(app)
      .post('/categories')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Food',
        icon: 'fi/FiShoppingCart',
        color: '##9C107B',
      });

    const category = await categoryRepository.findOne({
      where: {
        title: 'Food',
      },
    });

    expect(category).toBeTruthy();

    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should be able to list categories', async () => {
    const response = await request(app)
      .get('/categories')
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Food',
        }),
      ]),
    );
  });

  it('should be able to update category', async () => {
    const categoryRepository = testDataSource.getRepository(Category);

    const category = await categoryRepository.findOne({where:{}});

    expect(category).toBeTruthy();

    if (category) {
      const response = await request(app)
        .put(`/categories/${category.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          ...category,
          title: 'Foods',
        });

      expect(response.body).toMatchObject(
        expect.objectContaining({
          title: 'Foods',
        }),
      );
    }
  });

  it('should be able to delete a category', async () => {
    const categoryRepository = testDataSource.getRepository(Category);

    const responseCategory = await request(app)
      .post('/categories')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'iFood',
        icon: 'fi/FiShoppingCart',
        color: '#222',
      }).expect(200);

    const category = await categoryRepository.findOne({where: {id: responseCategory.body.id}});

    expect(category).toBeTruthy();

    const response = await request(app)
      .delete(`/categories/${category?.id}`)
      .auth(token, { type: 'bearer' })
      .send();

    expect(response.status).toBe(204);

    const categoryAfterDelete = await categoryRepository.findOne({where: {id: category?.id}});

    expect(categoryAfterDelete).toBeFalsy();
  });

});
