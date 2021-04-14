import test from 'japa';
import { post, get, auth } from '../test-helpers';
import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
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

test.group('Unuthenticated users', (group) => {
  test('can not fetch user info', async (assert) => {
    const response = await post('/auth/info/').expect(401);
  });

  test('can validate a token', async (assert) => {
    const response = await post('/auth/validate/').expect(200);

    assert.isFalse(response.body.valid);
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

  test('fails for an unverified user', async (assert) => {
    const response = await post('/auth/login/')
      .send({ email: 'user@kulturdaten.berlin', password: 'secret' })
      .expect(428);
  });

  test('as a verified user returns an auth token', async (assert) => {
    // Force verify the test user here, to work around
    // testing the /verify endpoint
    const user = await User.findBy('email', 'user@kulturdaten.berlin');
    user.status = UserStatus.ACTIVE;
    await user.save();

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
    const response = await post('/auth/info/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);

    assert.isString(response.body.user.email);
  });

  test('can validate their token', async (assert) => {
    const response = await post('/auth/validate/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);

    assert.isTrue(response.body.valid);
  });

  test('can log out', async (assert) => {
    await post('/auth/logout/')
      .set('Authorization', `Bearer ${await auth(true)}`)
      .expect(200);
  });
});
