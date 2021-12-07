import test from 'japa';
import { post, get, destroy, auth } from '../test-helpers';

test.group('App tokens can be created', () => {
  test('with a name', async (assert) => {
    const response = await post('/appToken/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({
        attributes: {
          name: 'Test App Token',
        },
      })
      .expect(200);

    assert.isString(response.body.meta.token.token);
    assert.equal(response.body.meta.token.name, 'Test App Token');
  });

  test('an optional description', async (assert) => {
    const response = await post('/appToken/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({
        attributes: {
          name: 'Test App Token 2',
          description: 'Test Description',
        },
      });

    assert.isString(response.body.meta.token.token);
    assert.equal(response.body.meta.token.name, 'Test App Token 2');
    assert.equal(response.body.meta.token.description, 'Test Description');
  });

  test('only with names that are unique', async (assert) => {
    const name = `Test App Token (${Date.now()})`;

    await post('/appToken/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({
        attributes: {
          name,
        },
      })
      .expect(200);

    await post('/appToken/')
      .set('Authorization', `Bearer ${await auth()}`)
      .send({
        attributes: {
          name,
        },
      })
      .expect(422);
  });
});

let tokens;
test('App tokens can be listed', async (assert) => {
  const response = await get('/appToken/')
    .set('Authorization', `Bearer ${await auth()}`)
    .send()
    .expect(200);

  tokens = response.body.meta.tokens;
  assert.isAtLeast(tokens.length, 2);
});

test('App tokens can be deleted by ID', async (assert) => {
  let response = await destroy('/appToken/')
    .set('Authorization', `Bearer ${await auth()}`)
    .send({
      id: tokens[0].id,
    })
    .expect(200);

  response = await get('/appToken/')
    .set('Authorization', `Bearer ${await auth()}`)
    .send()
    .expect(200);

  assert.isAtLeast(response.body.meta.tokens.length, 1);
});
