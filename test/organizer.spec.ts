import test from 'japa';
import { post, get, destroy, auth } from '../test-helpers';
import Mail from '@ioc:Adonis/Addons/Mail';

test.group('Creating an organizer', () => {
  test('fails with unsufficient data and provides validation errors', async (assert) => {
    const response = await post('/v1/organizer/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({})
      .expect(422);
    assert.lengthOf(response.body.errors, 4);
  });

  test('fails for unauthenticated users', async (assert) => {
    await post('/v1/organizer/').send({}).expect(401);
  });

  test('works for authenticated users with valid data', async (assert) => {
    const response = await post('/v1/organizer/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({
        name: 'Technologiestiftung Berlin',
        street1: 'Grunewaldstraße 61-62',
        city: 'Berlin',
        zipCode: '10825',
      })
      .expect(200);

    assert.ownInclude(response.body.data.attributes, {
      name: 'Technologiestiftung Berlin',
      street_1: 'Grunewaldstraße 61-62',
      city: 'Berlin',
      zip_code: '10825',
    });
  });
});

test.group('Listing organizers', () => {
  test('works for unauthenticated users', async (assert) => {
    await get('/v1/organizer/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });

  test('works for authenticated users', async (assert) => {
    await get('/v1/organizer/')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });
});

test.group('Destroying organizers', () => {
  test('fails for unauthenticated users', async (assert) => {
    await destroy('/v1/organizer/1').expect(401);
  });

  test('works for authenticated users', async (assert) => {
    await destroy('/v1/organizer/1')
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });
});
