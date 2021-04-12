import test from 'japa';
import { post, get, auth } from '../test-helpers';
import User from 'App/Models/User';
import Mail from '@ioc:Adonis/Addons/Mail';

test.group('Registering as a new user', () => {
  test('fails without any data and provides validation errors', async (assert) => {
    const response = await post('/auth/register/').send({}).expect(422);
    assert.lengthOf(response.body.errors, 2);
  });

  test('fails with unsufficient data and provides validation errors', async (assert) => {
    const response = await post('/auth/register/')
      .send({ email: 'user@kulturdaten.berlin' })
      .expect(422);
    assert.lengthOf(response.body.errors, 1);
  });

  test('adds one to the database and sends opt-in mail', async (assert) => {
    const inbox = new Promise((resolve) => {
      Mail.trap((message) => {
        resolve(message);
      });
    });

    const response = await post('/auth/register/')
      .send({
        email: 'user@kulturdaten.berlin',
        password: 'secret',
        password_confirmation: 'secret',
      })
      .expect(200);

    const message = await inbox;
    const user = await User.findByOrFail('email', response.body.user.email);

    assert.equal(response.body.user.email, user.email);
    assert.equal(message.to[0].address, 'user@kulturdaten.berlin');

    Mail.restore();
  });
});

test.group('Logging in', () => {
  test('fails without any data and provides validation errors', async (assert) => {
    const response = await post('/auth/login/').send({}).expect(422);
    assert.lengthOf(response.body.errors, 2);
  });

  test('fails with unsufficient data and provides validation errors', async (assert) => {
    const response = await post('/auth/login/')
      .send({ email: 'user@kulturdaten.berlin' })
      .expect(422);
    assert.lengthOf(response.body.errors, 1);
  });

  test('as a valid user returns an auth token', async (assert) => {
    const response = await post('/auth/login/')
      .send({
        email: 'user@kulturdaten.berlin',
        password: 'secret',
      })
      .expect(200);

    assert.isString(response.body.token.token);
  });
});

test.group('Authenticated users', (group) => {
  test('can fetch their info', async (assert) => {
    const response = await get('/auth/info/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);

    assert.equal(response.body.user.email, 'user@kulturdaten.berlin');
  });

  test('can validate their token', async (assert) => {
    const response = await get('/auth/validate/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);

    assert.isTrue(response.body.valid);
  });
});
