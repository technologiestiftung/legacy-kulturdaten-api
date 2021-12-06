import test from 'japa';
import { post, patch, auth } from '../../test-helpers';

test.group(
  'KDP-209: Accessibility field updates are handled individually per location',
  async (group) => {
    let organizerId;
    const locationIds = [];

    test('Creating an organizer with two locations', async (assert) => {
      const organizer = await post('/v1/organizer/?include=roles')
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            translations: [
              {
                attributes: {
                  name: 'Test organizer (KDP-209)',
                  language: 'en',
                },
              },
            ],
          },
        })
        .expect(200);
      organizerId = organizer.body.data.id;

      for (let index = 0; index < 2; index++) {
        const location = await post(`/v1/location/`)
          .set('Authorization', `Bearer ${await auth()}`)
          .send({
            relations: {
              organizer: organizerId,
            },
          })
          .expect(200);
        locationIds.push(location.body.data.id);
      }
    });

    test('Updating the first location with individual and same a11y information', async (assert) => {
      let response;
      response = await patch(`/v1/location/${locationIds[0]}/accessibility`)
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            fields: [
              {
                attributes: {
                  type: 'string',
                  key: 'both.locations',
                  value: 'value',
                },
              },
              {
                attributes: {
                  type: 'string',
                  key: 'location.1',
                  value: 'value',
                },
              },
            ],
          },
        })
        .expect(200);

      assert.lengthOf(response.body.data.relations.fields, 2);

      response = await patch(`/v1/location/${locationIds[0]}/accessibility`)
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            fields: [
              {
                attributes: {
                  type: 'string',
                  key: 'both.locations',
                  value: 'new-value',
                },
              },
            ],
          },
        })
        .expect(200);

      assert.deepEqual(
        response.body.data.relations.fields.map((field) => {
          return { attributes: field.attributes };
        }),
        [
          {
            attributes: {
              type: 'string',
              key: 'both.locations',
              value: 'new-value',
            },
          },
          {
            attributes: {
              type: 'string',
              key: 'location.1',
              value: 'value',
            },
          },
        ]
      );
    });

    test('Updating the second location with individual a11y information', async (assert) => {
      let response;
      response = await patch(`/v1/location/${locationIds[1]}/accessibility`)
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            fields: [
              {
                attributes: {
                  type: 'string',
                  key: 'both.locations',
                  value: 'value',
                },
              },
              {
                attributes: {
                  type: 'string',
                  key: 'location.2',
                  value: 'value',
                },
              },
            ],
          },
        })
        .expect(200);

      assert.lengthOf(response.body.data.relations.fields, 2);

      response = await patch(`/v1/location/${locationIds[1]}/accessibility`)
        .set('Authorization', `Bearer ${await auth()}`)
        .send({
          relations: {
            fields: [
              {
                attributes: {
                  type: 'string',
                  key: 'both.locations',
                  value: 'new-value',
                },
              },
            ],
          },
        })
        .expect(200);

      assert.deepEqual(
        response.body.data.relations.fields.map((field) => {
          return { attributes: field.attributes };
        }),
        [
          {
            attributes: {
              type: 'string',
              key: 'both.locations',
              value: 'new-value',
            },
          },
          {
            attributes: {
              type: 'string',
              key: 'location.2',
              value: 'value',
            },
          },
        ]
      );
    });
  }
);
