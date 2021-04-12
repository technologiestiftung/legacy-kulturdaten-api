import supertest from 'supertest';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

export function post(path) {
  return supertest(BASE_URL).post(path).set('Accept', 'application/json');
}

export function get(path) {
  return supertest(BASE_URL).get(path).set('Accept', 'application/json');
}

export async function auth() {
  const response = await post('/auth/login/').send({
    email: 'user@kulturdaten.berlin',
    password: 'secret',
  });

  return response.body.token.token;
}
