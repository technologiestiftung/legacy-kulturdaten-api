import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import { Service, ServiceField } from 'App/Models/Location';
import {
  UpdateServiceValidator,
  DeleteServiceValidator,
} from 'App/Validators/v1/ServiceValidator';

export default class ServiceManager extends BaseManager<typeof Service> {
  public ModelClass = Service;

  public settings = {
    queryId: 'location_id',
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Service);
  }

  public query() {
    return super.query().preload('fields');
  }

  private async $updateFields(service, fields) {
    if (!fields.length) {
      return;
    }

    const keys = fields.map((role) => {
      return role.attributes.key;
    });

    const existingFields = keys.length
      ? await ServiceField.query().whereIn('key', keys)
      : [];
    return this.$updateMany(
      service,
      'fields',
      fields.map((field) => {
        for (const existingField of existingFields) {
          if (existingField.key === field.attributes.key) {
            field.id = existingField.id;
            continue;
          }
        }

        return field;
      })
    );
  }

  public async update() {
    const { relations } = await this.ctx.request.validate(
      new UpdateServiceValidator(this.ctx)
    );

    const service = await this.byId();
    await this.$updateFields(service, relations?.fields);

    return this.instance;
  }

  public async delete() {
    const { relations } = await this.ctx.request.validate(
      new DeleteServiceValidator(this.ctx)
    );

    return [...(await this.$deleteObjects(ServiceField, relations?.fields))];
  }
}
