import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Organizer, { OrganizerStatus } from 'App/Models/Organizer/Organizer';
import {
  tags,
  links,
  address,
  media,
  initialTranslation,
} from 'App/Helpers/Validator';
import { allowedLanguages } from 'Config/app';

export class CreateOrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public refs = schema.refs({
    organizerTypeId: this.context.request.input('relations')?.type,
  });

  public schema = schema.create({
    attributes: schema.object.optional().members({
      email: schema.string.optional({ trim: true }, [rules.email()]),
      phone: schema.string.optional({ trim: true }, [rules.mobile()]),
      homepage: schema.string.optional({ trim: true }, [rules.url()]),
      status: schema.enum.optional(Object.values(OrganizerStatus)),
    }),
    relations: schema.object.optional().members({
      translations: initialTranslation,
      address: address.create,
      contacts: schema.array.optional().members(
        schema.object.optional().members({
          attributes: schema.object().members({
            phone: schema.string.optional({ trim: true }, [
              rules.mobile(),
              rules.requiredIfNotExists('email'),
            ]),
            email: schema.string.optional({ trim: true }, [
              rules.email(),
              rules.requiredIfNotExists('phone'),
            ]),
          }),
          relations: schema.object().members({
            translations: schema.array.optional([rules.minLength(1)]).members(
              schema.object().members({
                name: schema.string({ trim: true }),
                language: schema.enum(allowedLanguages),
              })
            ),
          }),
        })
      ),
      types: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'organizer_types',
            column: 'id',
          }),
        ])
      ),
      subjects: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
          }),
        ])
      ),
      links,
      tags,
    }),
    logo: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'gif', 'png', 'webp', 'svg'],
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateOrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(OrganizerStatus)),
      email: schema.string.optional({ trim: true }, [rules.email()]),
      phone: schema.string.optional({ trim: true }, [rules.mobile()]),
      homepage: schema.string.optional({ trim: true }, [rules.url()]),
    }),
    relations: schema.object.optional().members({
      types: schema.array.optional([rules.minLength(1)]).members(
        schema.number([
          rules.exists({
            table: 'organizer_types',
            column: 'id',
          }),
        ])
      ),
      contacts: schema.array.optional().members(
        schema.object.optional().members({
          attributes: schema.object().members({
            phone: schema.string.optional({ trim: true }, [
              rules.mobile(),
              rules.requiredIfNotExists('email'),
            ]),
            email: schema.string.optional({ trim: true }, [
              rules.email(),
              rules.requiredIfNotExists('phone'),
            ]),
          }),
          relations: schema.object().members({
            translations: schema.array.optional([rules.minLength(1)]).members(
              schema.object().members({
                name: schema.string({ trim: true }),
                language: schema.enum(allowedLanguages),
              })
            ),
          }),
        })
      ),
      subjects: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'organizer_subjects',
            column: 'id',
          }),
        ])
      ),
      address: address.update,
      links,
      tags,
    }),
    logo: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'gif', 'png', 'webp', 'svg'],
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class DeleteOrganizerValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      id: schema.string({}, [
        rules.exists({
          table: 'organizers',
          column: 'public_id',
        }),
      ]),
    }),
    relations: schema.object.optional().members({
      contacts: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'organizer_contacts',
            column: 'id',
          }),
        ])
      ),
      address: schema.number.optional([
        rules.exists({
          table: 'address',
          column: 'id',
        }),
      ]),
      logo: schema.number.optional([
        rules.exists({
          table: 'media',
          column: 'id',
        }),
      ]),
      media: schema.array.optional().members(
        schema.number([
          rules.exists({
            table: 'media',
            column: 'id',
          }),
        ])
      ),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishOrganizerValidator {
  constructor(private organizer: Organizer) {}

  public schema = schema.create({
    attributes: schema.object().members({
      status: schema.enum(Object.values(OrganizerStatus)),
    }),
    relations: schema.object().members({
      address: schema.object().members({
        attributes: schema.object().members({
          street1: schema.string({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string({ trim: true }),
          city: schema.string({ trim: true }),
        }),
      }),
      types: schema.array([rules.minLength(1)]).members(
        schema.object().members({
          id: schema.number(),
        })
      ),
    }),
  });

  public messages = {};
}
