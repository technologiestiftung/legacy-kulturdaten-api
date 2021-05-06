import { LucidRow } from '@ioc:Adonis/Lucid/Model';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export class ApiResource {
  public static create(
    ctx: HttpContextContract,
    data: LucidRow | Array<LucidRow>
  ) {
    try {
      if (Array.isArray(data)) {
        return data.map((model) => {
          return new ApiResource(ctx, model);
        });
      }

      return new ApiResource(ctx, data);
    } catch (e) {}
  }

  constructor(ctx: HttpContextContract, model: LucidRow) {
    this.model = model;
    this.type = model.constructor.name.toLowerCase();
    this.id = model.$primaryKeyValue;
    try {
      this.attributes = model.serialize();
    } catch (e) {
      ctx.logger.error(
        `Could not serialize ${this.type} instance with id ${
          this.id
        } and attributes ${JSON.stringify(this.model.$attributes)}: ${e}`
      );
    }
  }

  public toJSON() {
    return {
      type: this.type,
      id: this.id,
      attributes: this.attributes,
    };
  }
}
