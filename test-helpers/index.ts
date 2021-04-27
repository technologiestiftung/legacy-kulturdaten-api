import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

export function post(path) {
  return supertest(BASE_URL).post(path).set('Accept', 'application/json');
}

export function get(path) {
  return supertest(BASE_URL).get(path).set('Accept', 'application/json');
}

let token = null;
export async function auth(fresh) {
  if (!token) {
    const testUser = new User();
    testUser.email = 'test@kulturdaten.berlin';
    testUser.password = 'secret';
    testUser.status = UserStatus.ACTIVE;
    await testUser.save();

    const { body } = await post('/auth/login/').send({
      email: 'test@kulturdaten.berlin',
      password: 'secret',
    });

    token = body.meta.token;
  }

  if (fresh) {
    const { body } = await post('/auth/login/').send({
      email: 'test@kulturdaten.berlin',
      password: 'secret',
    });

    return body.meta.token;
  }

  return token;
}
