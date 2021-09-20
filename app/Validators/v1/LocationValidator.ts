import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { LocationStatus, LocationTypes } from 'App/Models/Location';

export class CreatePhysicalLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.PHYSICAL)]),
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      address: schema.object.optional().members({
        attributes: schema.object().members({
          street1: schema.string({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string({ trim: true }),
          city: schema.string({ trim: true }),
        }),
      }),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
    media: schema.array.optional().members(
      schema.file.optional({
        size: '10mb',
        extnames: ['jpg', 'gif', 'png', 'webp'],
      })
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class CreateVirtualLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.VIRTUAL)]),
    attributes: schema.object().members({
      name: schema.string({ trim: true }),
      description: schema.string.optional({ trim: true }),
      url: schema.string({}, [rules.url()]),
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
    media: schema.array.optional().members(
      schema.file.optional({
        size: '10mb',
        extnames: ['jpg', 'gif', 'png', 'webp'],
      })
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdatePhysicalLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.PHYSICAL)]),
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      address: schema.object.optional().members({
        attributes: schema.object().members({
          street1: schema.string.optional({ trim: true }),
          street2: schema.string.optional({ trim: true }),
          zipCode: schema.string.optional({ trim: true }),
          city: schema.string.optional({ trim: true }),
        }),
      }),
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
    media: schema.array.optional().members(
      schema.file.optional({
        size: '10mb',
        extnames: ['jpg', 'gif', 'png', 'webp'],
      })
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateVirtualLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.VIRTUAL)]),
    attributes: schema.object().members({
      url: schema.string.optional({}, [rules.url()]),
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
    media: schema.array.optional().members(
      schema.file.optional({
        size: '10mb',
        extnames: ['jpg', 'gif', 'png', 'webp'],
      })
    ),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class PublishPhysicalLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.PHYSICAL)]),
    attributes: schema.object().members({
      status: schema.enum(Object.values(LocationStatus)),
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
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
  });

  public messages = {};
}

export class PublishVirtualLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.VIRTUAL)]),
    attributes: schema.object().members({
      url: schema.string({}, [rules.url()]),
      status: schema.enum(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      links: schema.array
        .optional([rules.maxLength(3)])
        .members(schema.string({}, [rules.url()])),
    }),
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}
