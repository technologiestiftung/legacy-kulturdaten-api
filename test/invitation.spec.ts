import test from 'japa';
import { post, get, destroy, auth } from '../test-helpers';
import Mail from '@ioc:Adonis/Addons/Mail';

test.group('Creating an invitation', () => {
  test.skip('fails with unsufficient data and provides validation errors', async (assert) => {
    const response = await post('/invitation/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({ email: 'user' })
      .expect(422);
    assert.lengthOf(response.body.errors, 1);
  });

  test.skip('fails for unauthenticated users', async (assert) => {
    const response = await post('/invitation/')
      .send({ email: 'invitee@kulturdaten.berlin' })
      .expect(401);
  });

  test.skip('works for authenticated users with valid data and sends invitation', async (assert) => {
    const inbox = new Promise((resolve) => {
      Mail.trap((message) => {
        resolve(message);
      });
    });

    const response = await post('/invitation/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({ email: 'invitee@kulturdaten.berlin' })
      .expect(200);

    assert.equal(
      response.body.data.attributes.email,
      'invitee@kulturdaten.berlin'
    );

    const message = await inbox;
    assert.equal(message.to[0].address, 'invitee@kulturdaten.berlin');

    Mail.restore();
  });
});

test.group('Listing invitations', () => {
  test.skip('fails for unauthenticated users', async (assert) => {
    await get('/invitation/').expect(401);
  });

  test.skip('works for authenticated users', async (assert) => {
    await get('/invitation/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });
});

test.group('Destroying invitations', () => {
  test.skip('fails for unauthenticated users', async (assert) => {
    await destroy('/invitation/1').expect(401);
  });

  test.skip('works for authenticated users', async (assert) => {
    await destroy('/invitation/1')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });
});
