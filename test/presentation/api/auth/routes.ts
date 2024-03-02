import { ProductModel, UserModel } from '../../../../src/data';
import { TestDatabase } from '../../../test-database';
import { testServer } from '../../../test-server';
import request from 'supertest';

describe('Api auth routes testing', () => {
  const signupRoute = '/api/v1/auth/signup';
  const loginRoute = '/api/v1/auth/login';

  beforeAll(async () => {
    await testServer.start();
    await TestDatabase.start();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
  });

  afterAll(async () => {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();
    await testServer.close();
    TestDatabase.close();
  });

  const user1 = {
    name: 'User 1',
    email: 'user1@example.com',
    password: 'M5e5k5i57.',
  };

  const user2 = {
    name: 'User 2',
    email: 'user2@example.com',
    password: 'M5e5k5i57.',
  };
  describe('Signup route tests api/auth/signup', () => {
    test('Should create an user api/auth/signup', async () => {
      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send(user1)
        .expect(201);

      expect(body).toEqual({
        id: expect.any(String),
        name: user1.name,
        email: user1.email,
        lastName: 'last name',
        location: 'my city',
        role: 'user',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    test('Should return an duplicate email error api/auth/signup', async () => {
      await UserModel.create(user1);

      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send(user1)
        .expect(400);

      expect(body).toEqual({
        error: 'Email already exists, try another one',
      });
    });

    test('Should return a 400 error missing name api/auth/signup', async () => {
      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send({})
        .expect(400);

      expect(body).toEqual({ error: 'Name is required' });
    });

    test('Should return a 400 error missing email api/auth/signup', async () => {
      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send({ name: 'test' })
        .expect(400);

      expect(body).toEqual({ error: 'Email is required' });
    });

    test('Should return a 400 error invalid email api/auth/signup', async () => {
      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send({ name: 'test', email: 'test@example' })
        .expect(400);

      expect(body).toEqual({ error: 'Email is not a valid email' });
    });

    test('Should return a 400 error required password api/auth/signup', async () => {
      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send({ name: 'test', email: 'test@example.com' })
        .expect(400);

      expect(body).toEqual({ error: 'Password is required' });
    });

    test('Should return a 400 error required password api/auth/signup', async () => {
      const { body } = await request(testServer.app)
        .post(signupRoute)
        .send({ name: 'test', email: 'test@example.com', password: '1234' })
        .expect(400);

      expect(body).toEqual({
        error:
          'Invalid password, password must be at least 6 characters long and contain numbers, symbols, and upper case and lower case characters',
      });
    });
  });

  describe('Auth route tests api/auth/login', () => {
    const loginUser = {
      email: 'user1@example.com',
      password: 'M5e5k5i57.',
    };

    test('Should return 200 api/auth/login', async () => {
      await UserModel.create(user1);

      const { body } = await request(testServer.app)
        .post(loginRoute)
        .send(loginUser)
        .expect(200);

      expect(body).toEqual({ msg: 'user successfully logged in' });
    });

    test('Should return 401 api/auth/login', async () => {
      const { body } = await request(testServer.app)
        .post(loginRoute)
        .send(loginUser)
        .expect(401);

      expect(body).toEqual({ error: 'Incorrect email or password' });
    });

    test('Should return 400 error required email api/auth/login', async () => {
      const { body } = await request(testServer.app)
        .post(loginRoute)
        .send()
        .expect(400);

      expect(body).toEqual({ error: 'Email is required' });
    });

    test('Should return 400 error required password api/auth/login', async () => {
      const { body } = await request(testServer.app)
        .post(loginRoute)
        .send({ email: 'user1@example.com' })
        .expect(400);

      expect(body).toEqual({ error: 'Password is required' });
    });

    test('Should return 401 error incorrect password api/auth/login', async () => {
      const { body } = await request(testServer.app)
        .post(loginRoute)
        .send({ email: 'user1@example.com', password: '1234' })
        .expect(401);

      expect(body).toEqual({
        error: 'Incorrect email or password',
      });
    });
  });
});
