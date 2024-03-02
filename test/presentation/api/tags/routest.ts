import { ProductModel, UserModel } from '../../../../src/data';
import { TestDatabase } from '../../../test-database';
import { testServer } from '../../../test-server';
import request from 'supertest';

describe('Api tags routes testing', () => {
  beforeAll(async () => {
    await testServer.start();
    await TestDatabase.start();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
  });

  afterAll(async () => {
    await testServer.close();
    TestDatabase.close();
  });

  test('should return an Array of unique tags', async () => {
    const product1 = {
      name: 'Product 1',
      price: 1,
      tags: ['motor', 'work'],
      image: '',
      createdBy: '65841a5906122a3ef78f73c7',
    };

    const product2 = {
      name: 'Product 2',
      price: 2,
      tags: ['lifestyle', 'motor'],
      image: '',
      createdBy: '65841a5906122a3ef78f73c7',
    };

    await ProductModel.insertMany([product1, product2]);

    const { body } = await request(testServer.app)
      .get('/api/v1/tags')
      .expect(200);

    expect(body).toEqual(['motor', 'work', 'lifestyle']);
  });
});
