import test from 'japa';
import { post, get, auth } from '../test-helpers';
import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
import Mail from '@ioc:Adonis/Addons/Mail';

test.group('Creating an invitation', () => {
  test('fails with unsufficient data and provides validation errors', async (assert) => {
    const response = await post('/invitation/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({ email: 'user' })
      .expect(422);
    assert.lengthOf(response.body.errors, 1);
  });

  test('fails for unauthenticated users', async (assert) => {
    const response = await post('/invitation/')
      .send({ email: 'invitee@kulturdaten.berlin' })
      .expect(401);
  });

  test('works for authenticated users with valid data', async (assert) => {
    const response = await post('/invitation/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({ email: 'invitee@kulturdaten.berlin' })
      .expect(200);

    assert.equal(response.body.invitation.email, 'invitee@kulturdaten.berlin');
  });
});

test.group('Listing invitations', () => {
  test('works for authenticated users', async (assert) => {
    const response = await get('/invitation/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });
});
