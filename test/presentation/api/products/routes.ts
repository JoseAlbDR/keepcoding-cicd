import { ProductModel, UserModel } from '../../../../src/data';
import { TestDatabase } from '../../../test-database';
import { testServer } from '../../../test-server';
import request from 'supertest';

describe('Api products routes testing', () => {
  const productsRoute = '/api/v1/products';
  const loginRoute = '/api/v1/auth/login';

  const getCookie = async () => {
    await UserModel.create({
      name: 'Tester',
      email: 'test@example.com',
      password: 'M5e5k5i57.',
    });

    const loginResponse = await request(testServer.app).post(loginRoute).send({
      email: 'test@example.com',
      password: 'M5e5k5i57.',
    });

    const tokenCookie = loginResponse.headers['set-cookie'];

    return tokenCookie;
  };

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

  const product1 = {
    name: 'Product 1',
    price: 1,
    tags: ['motor'],
    image: '',
    createdBy: '507f1f77bcf86cd799439011',
  };

  const product2 = {
    name: 'Product 2',
    price: 2,
    tags: ['lifestyle', 'motor'],
    image: '',
    createdBy: '507f1f77bcf86cd799439011',
  };

  describe('Products route test get', () => {
    test('should return an array of products', async () => {
      const tokenCookie = await getCookie();

      await Promise.all([
        request(testServer.app)
          .post(productsRoute)
          .set('Cookie', tokenCookie) // Attach the token as a cookie in subsequent requests
          .send(product1)
          .expect(201),
        request(testServer.app)
          .post(productsRoute)
          .set('Cookie', tokenCookie) // Attach the token as a cookie in subsequent requests
          .send(product2)
          .expect(201),
      ]);

      const { body } = await request(testServer.app)
        .get(productsRoute)
        .set('Cookie', tokenCookie)
        .expect(200);

      expect(body).toEqual({
        currentPage: expect.any(Number),
        maxPages: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        next: null,
        prev: null,
        products: expect.any(Array),
      });
    });
  });

  describe('Products route test post', () => {
    test('Should return a new product', async () => {
      const tokenCookie = await getCookie();

      const { body } = await request(testServer.app)
        .post(productsRoute)
        .set('Cookie', tokenCookie) // Attach the token as a cookie in subsequent requests
        .send(product1)
        .expect(201);

      expect(body).toEqual({
        id: expect.any(String),
        name: product1.name,
        sale: false,
        tags: expect.any(Array),
        price: expect.any(Number),
        createdBy: expect.any(String),
        image: expect.any(String),
      });
    });

    test('Should return missing name error', async () => {
      const tokenCookie = await getCookie();
      const product = {};

      const { body } = await request(testServer.app)
        .post(productsRoute)
        .set('Cookie', tokenCookie)
        .send(product)
        .expect(400);

      expect(body).toEqual({ error: 'Missing name' });
    });

    //TODO rest of validation errors
  });
});
