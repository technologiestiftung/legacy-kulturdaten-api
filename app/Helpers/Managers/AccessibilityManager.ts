import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
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

  public async update() {
    const { relations } = await this.ctx.request.validate(
      new UpdateAccessibilityValidator(this.ctx)
    );

    const accessibility = await this.byId();
    await this.$updateMany(accessibility, 'fields', relations?.fields);

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
