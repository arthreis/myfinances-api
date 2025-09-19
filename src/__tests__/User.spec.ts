import request from 'supertest';
import type { DataSource } from 'typeorm';
import { dataSource } from '../shared/infra/typeorm/config/datasources/ormconfig';

import app from '../app';

let connection: DataSource;

describe('User', () => {
  beforeAll(async () => {
    connection = await dataSource.initialize();

    await connection.query('DROP TABLE IF EXISTS transactions');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS users');
    await connection.query('DROP TABLE IF EXISTS migrations');

    await connection.runMigrations();
  });

  it('should be able to reject wrong login request', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'vitor.medeiro10@gmail.com',
      password: 'teste123',
    });

    expect(response.status).toBe(401);
  });

  it('should be able to perform register', async () => {
    const response = await request(app).post('/users').send({
      name: 'Vitor Medeiro',
      email: 'vitor.medeiro10@gmail.com',
      password: 'teste123',
    });

    expect(response.body).toMatchObject(
      expect.objectContaining({
        name: 'Vitor Medeiro',
      }),
    );
  });

  it('should be able to perform login request', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'vitor.medeiro10@gmail.com',
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
      name: 'Vitor Medeiro',
      email: 'vitor.medeiro10@gmail.com',
      password: 'teste123',
    });

    expect(response.status).toBe(400);
  });
});
