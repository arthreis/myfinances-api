import request from 'supertest';
import { hash } from 'bcrypt';
import { dataSource as ormconfigDatasource } from '../shared/infra/typeorm/config/datasources/ormconfig';
import Transaction from '../modules/transactions/entities/Transaction';
import app from '../app';

let token: string;
let category_id: string;

describe('Transaction', () => {
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

    await testDataSource.query(
      `INSERT INTO users (name, email, password) VALUES ('test', 'teste@teste.com', $1)`,
      [await hash('teste123', 8)],
    );

    const responseLogin = await request(app).post('/sessions').send({
      email: 'teste@teste.com',
      password: 'teste123',
    });
    token = responseLogin.body.token;

    const responseCategory = await request(app)
      .post('/categories')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Food',
        icon: 'fi/FiShoppingCart',
        color: '##F38EDC',
    });
    category_id = responseCategory.body.id;

  });

  beforeEach(async () => {
    await testDataSource.query('TRUNCATE TABLE transactions');
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

  it('should be able to create new transaction', async () => {
    const transactionsRepository = testDataSource.getRepository(Transaction);

    const responseTransaction = await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'March Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    const transaction = await transactionsRepository.findOne({
      where: {
        title: 'March Salary',
      },
    });

    expect(transaction).toBeTruthy();

    expect(responseTransaction.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should be able to list transactions', async () => {

    // create the first transaction
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'March Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // create the second transaction
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'April Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // create the third transaction
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Macbook',
        type: 'outcome',
        value: 6000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // list all transactions
    const response = await request(app)
    .get('/transactions?period=2025-09&page=1&pageSize=20')
    .auth(token, { type: 'bearer' });

    // check if the response has 3 transactions
    expect(response.body.transactions).toHaveLength(3);
  });

  it('should be able to delete a transaction', async () => {
    const transactionsRepository = testDataSource.getRepository(Transaction);

    // create a transaction
    const response = await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'March Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // delete the transaction
    await request(app)
      .delete(`/transactions/${response.body.id}`)
      .auth(token, { type: 'bearer' }).expect(204);

    // find the transaction deleted
    const transaction = await transactionsRepository.findOne({where: {id: response.body.id}});

    // check if the transaction is deleted
    expect(transaction).toBeFalsy();
  });

  it('should be able to updated a transaction', async () => {
    const transactionsRepository = testDataSource.getRepository(Transaction);

    // create a transaction
    const responseTransaction = await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'March Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // update the transaction
    await request(app)
    .put(`/transactions/${responseTransaction.body.id}`)
    .auth(token, { type: 'bearer' })
    .send({
      title: 'March Salary Edited',
      type: 'outcome',
      value: 4500,
      category_id: category_id,
      transaction_date: '2024-09-28',
      description: 'lorem ipsum edited'
    });

    const transaction: Transaction | null = await transactionsRepository.findOne({where: {id: responseTransaction.body.id}});

    expect(transaction).toBeTruthy();
    expect(transaction?.title).toBe('March Salary Edited');
    expect(transaction?.type).toBe('outcome');
    expect(transaction?.value).toBe(4500);
    expect(transaction?.transaction_date.toISOString().slice(0,10)).toEqual(new Date('2024-09-28').toISOString().slice(0, 10));
    expect(transaction?.description).toBe('lorem ipsum edited');
  });

  it('should be able to get transactions balance by period', async () => {

    // create the first transaction
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'March Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // create the second transaction
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'April Salary',
        type: 'income',
        value: 4000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // create the third transaction
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Macbook',
        type: 'outcome',
        value: 6000,
        category_id: category_id,
        transaction_date: '2025-09-28',
        description: 'lorem ipsum'
      });

    // create the fourth transaction in another month
    await request(app)
      .post('/transactions')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Macbook',
        type: 'outcome',
        value: 6000,
        category_id: category_id,
        transaction_date: '2025-10-28',
        description: 'lorem ipsum'
      });

    const response = await request(app)
      .get('/transactions/balance?period=2025-09')
      .auth(token, { type: 'bearer' });

    const balance: { income: number; outcome: number; total: number; } = response.body;

    expect(balance).toBeTruthy();
    expect(balance.income).toBe(8000);
    expect(balance.outcome).toBe(6000);
    expect(balance.total).toBe(2000);
  });

});
