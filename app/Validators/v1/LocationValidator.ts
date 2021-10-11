import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { LocationStatus, LocationTypes } from 'App/Models/Location';
import {
  tags,
  links,
  media,
  address,
  initialTranslation,
} from 'App/Helpers/Validator';

export class CreatePhysicalLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.PHYSICAL)]),
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      address: address.create,
      tags,
      links,
      initialTranslation,
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class CreateVirtualLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.VIRTUAL)]),
    attributes: schema.object().members({
      url: schema.string({}, [rules.url()]),
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      tags,
      links,
      initialTranslation,
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdatePhysicalLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object.optional().members({
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      address: address.update,
      tags,
      links,
    }),
    media,
  });

  public cacheKey = this.context.routeKey;

  public messages = {};
}

export class UpdateVirtualLocationValidator {
  constructor(private context: HttpContextContract) {}

  public schema = schema.create({
    attributes: schema.object().members({
      url: schema.string.optional({}, [rules.url()]),
      status: schema.enum.optional(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      tags,
      links,
    }),
    media,
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
      address: address.publish,
      links,
    }),
  });

  public messages = {};
}

export class PublishVirtualLocationValidator {
  public schema = schema.create({
    type: schema.string({}, [rules.equalTo(LocationTypes.VIRTUAL)]),
    attributes: schema.object().members({
      url: schema.string({}, [rules.url()]),
      status: schema.enum(Object.values(LocationStatus)),
    }),
    relations: schema.object.optional().members({
      links,
    }),
  });

  public messages = {};
}
