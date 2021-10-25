import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import { Audience, AudienceField } from 'App/Models/Offer';
import {
  UpdateAudienceValidator,
  DeleteAudienceValidator,
} from 'App/Validators/v1/AudienceValidator';

export default class AudienceManager extends BaseManager<typeof Audience> {
  public ModelClass = Audience;

  public settings = {
    queryId: 'offer_id',
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Audience);
  }

  public query() {
    return super.query().preload('fields');
  }

  private async $updateFields(accessibility, fields) {
    if (!fields.length) {
      return;
    }

    const keys = fields.map((role) => {
      return role.attributes.key;
    });

    const existingFields = keys.length
      ? await AudienceField.query().whereIn('key', keys)
      : [];
    return this.$updateMany(
      accessibility,
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
      new UpdateAudienceValidator(this.ctx)
    );

    const accessibility = await this.byId();
    await this.$updateFields(accessibility, relations?.fields);

    return this.instance;
  }

  public async delete() {
    const { relations } = await this.ctx.request.validate(
      new DeleteAudienceValidator(this.ctx)
    );

    return [...(await this.$deleteObjects(AudienceField, relations?.fields))];
  }
}
