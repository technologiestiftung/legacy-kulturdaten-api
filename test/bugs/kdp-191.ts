import test from 'japa';
import { post, get, patch, auth } from '../../test-helpers';
import User from 'App/Models/User';

test.group(
  'KDP-191: Altering organizer owner role does not create a second role for owner',
  async (group) => {
    let organizerId;
    let editorEmail;

    test('Creating a new organizer adds the creating user as owner', async (assert) => {
      const response = await post('/v1/organizer/?include=roles')
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            translations: [
              {
                attributes: {
                  name: 'Test organizer',
                  language: 'en',
                },
              },
            ],
          },
        })
        .expect(200);

      assert.isString(response.body.data.id);
      organizerId = response.body.data.id;

      assert.lengthOf(response.body.data.relations.roles, 1);
      const roles = response.body.data.relations.roles.map((role) => {
        return {
          email: role.attributes.email,
          role: role.attributes.role,
        };
      });
      assert.deepEqual(roles, [
        { email: 'test@kulturdaten.berlin', role: 'owner' },
      ]);
    });

    test('Adding another user as editor creates a second role for them', async (assert) => {
      editorEmail = `test+${Date.now()}@kulturdaten.berlin`;
      const editor = await User.create({
        email: editorEmail,
        password: `${Date.now()}`,
      });

      const response = await patch(`/v1/organizer/${organizerId}`)
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            roles: [
              {
                attributes: {
                  role: 'editor',
                  email: editor.email,
                },
              },
            ],
          },
        })
        .expect(200);

      assert.lengthOf(response.body.data.relations.roles, 2);
      const roles = response.body.data.relations.roles.map((role) => {
        return {
          email: role.attributes.email,
          role: role.attributes.role,
        };
      });
      assert.deepEqual(roles, [
        { email: 'test@kulturdaten.berlin', role: 'owner' },
        { email: editor.email, role: 'editor' },
      ]);
    });

    test('Updating the owner role does not create a third role', async (assert) => {
      let response = await patch(`/v1/organizer/${organizerId}`)
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            roles: [
              {
                attributes: {
                  role: 'editor',
                  email: 'test@kulturdaten.berlin',
                },
              },
            ],
          },
        })
        .expect(200);

      assert.lengthOf(response.body.data.relations.roles, 2);
      const roles = response.body.data.relations.roles.map((role) => {
        return {
          email: role.attributes.email,
          role: role.attributes.role,
        };
      });
      assert.deepEqual(roles, [
        { email: 'test@kulturdaten.berlin', role: 'editor' },
        { email: editorEmail, role: 'editor' },
      ]);
    });
  }
);
