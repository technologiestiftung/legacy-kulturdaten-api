import Organizer from 'App/Models/Organizer';
import test from 'japa';
import { post, get, destroy, auth } from '../test-helpers';

test.group('Creating an organizer', () => {
  test('fails for unauthenticated users', async (assert) => {
    await post('/v1/organizer/').send({}).expect(401);
  });

  test('fails with unsufficient data and provides validation errors', async (assert) => {
    const response = await post('/v1/organizer/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({})
      .expect(422);
    assert.lengthOf(response.body.errors, 2);
  });

  test('works for authenticated users with valid data', async (assert) => {
    const response = await post('/v1/organizer/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({
        name: 'Technologiestiftung Berlin',
        address: {
          street1: 'Grunewaldstraße 61-62',
          city: 'Berlin',
          zipCode: '10825',
        },
      })
      .expect(200);

    const organizer = response.body.data.attributes;
    assert.equal(organizer.name, 'Technologiestiftung Berlin');
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

test.group('Showing details for an organizer', () => {
  test('works for unauthenticated users', async (assert) => {
    const organizer = await Organizer.first();
    const response = await get(`/v1/organizer/${organizer.cid}`).expect(200);

    assert.equal(
      response.body.data.attributes.name,
      'Technologiestiftung Berlin'
    );
  });

  test('works for authenticated users', async (assert) => {
    const organizer = await Organizer.first();
    const response = await get(`/v1/organizer/${organizer.cid}`)
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);

    assert.equal(
      response.body.data.attributes.name,
      'Technologiestiftung Berlin'
    );
  });
});

test.group('Destroying organizers', () => {
  test('fails for unauthenticated users', async (assert) => {
    const organizer = await Organizer.first();
    await destroy(`/v1/organizer/${organizer.cid}`).expect(401);
  });

  test('works for authenticated users', async (assert) => {
    const organizer = await Organizer.first();
    await destroy(`/v1/organizer/${organizer.cid}`)
      .set('Authorization', `Bearer ${await auth()}`)
      .expect(200);
  });
});
