import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

export function post(path) {
  return supertest(BASE_URL).post(path).set('Accept', 'application/json');
}

export function patch(path) {
  return supertest(BASE_URL).patch(path).set('Accept', 'application/json');
}

export function get(path) {
  return supertest(BASE_URL).get(path).set('Accept', 'application/json');
}

export function destroy(path) {
  return supertest(BASE_URL).delete(path).set('Accept', 'application/json');
}

let token = null;
export async function auth(fresh = false) {
  const email = `test${fresh ? '+' + Date.now() : ''}@kulturdaten.berlin`;
  const password = `${Date.now()}`;

  if (!token || fresh) {
    await User.create({
      email,
      password,
      status: UserStatus.ACTIVE,
    });

    const { body } = await post('/auth/login/').send({
      email,
      password,
    });

    if (!token && !fresh) {
      token = body.meta.token.token;
    } else {
      return body.meta.token.token;
    }
  }

  return token;
}
