import { ProductModel, UserModel } from '../../../../src/data';
import { TestDatabase } from '../../../test-database';
import { testServer } from '../../../test-server';
import path from 'path';
import request from 'supertest';

describe('Api fileupload routes testing', () => {
  const loginRoute = '/api/v1/auth/login';
  const uploadRoute = '/api/v1/upload';

  const getTokenCookie = async () => {
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

  test('should return single uploaded image name', async () => {
    const token = await getTokenCookie();
    const filePath = path.join(__dirname, 'images', 'test_image.jpg');

    expect.assertions(1);

    const { body } = await request(testServer.app)
      .post(`${uploadRoute}/single/products`)
      .set('Cookie', token)
      .attach('file', `${filePath}`)
      .expect(200);

    expect(body).toEqual({
      fileName: expect.any(String),
    });
  });
});
