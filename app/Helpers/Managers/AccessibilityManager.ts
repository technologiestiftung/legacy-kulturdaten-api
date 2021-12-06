import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import { Accessibility, AccessibilityField } from 'App/Models/Location';
import {
  UpdateAccessibilityValidator,
  DeleteAccessibilityValidator,
} from 'App/Validators/v1/AccessibilityValidator';

export default class AccessibilityManager extends BaseManager<
  typeof Accessibility
> {
  public ModelClass = Accessibility;

  public settings = {
    queryId: 'location_id',
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Accessibility);
  }

  public query() {
    return super.query().preload('fields');
  }

  private async $updateFields(accessibility, fields) {
    if (!fields.length) {
      return;
    }

    const keys = fields.map((field) => {
      return field.attributes.key;
    });

    const existingFields = keys.length
      ? await AccessibilityField.query()
          .whereIn('key', keys)
          .andWhere(
            'accessibility_id',
            Database.from('accessibilities')
              .select('id')
              .where('location_id', this.ctx.params.id)
          )
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
      new UpdateAccessibilityValidator(this.ctx)
    );

    const accessibility = await this.byId();
    await this.$updateFields(accessibility, relations?.fields);

    return this.instance;
  }

  public async delete() {
    const { relations } = await this.ctx.request.validate(
      new DeleteAccessibilityValidator(this.ctx)
    );

    return [
      ...(await this.$deleteObjects(AccessibilityField, relations?.fields)),
    ];
  }
}
