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

  private model: LucidRow;

  constructor(ctx: HttpContextContract, model: LucidRow) {
    this.model = model;
    this.type = model.constructor.name.toLowerCase();
    this.id = model.$primaryKeyValue;

    try {
      this.attributes = this.model.serializeAttributes();
      this.relations = this.serializeRelationships();
    } catch (e) {
      ctx.logger.error(
        `Could not serialize ${this.type} instance with id ${
          this.id
        } and attributes ${JSON.stringify(this.model.$attributes)}: ${e}`
      );
    }
  }

  private serializeRelationships() {
    const relations: { [relation: string]: Array<ApiResource> } = {};

    for (const [relationName, entries] of Object.entries(
      this.model.$preloaded
    )) {
      relations[relationName] = !Array.isArray(entries)
        ? ApiResource.create(this.ctx, entries)
        : entries.map((entry) => ApiResource.create(this.ctx, entry));
    }

    return relations;
  }

  public toJSON() {
    const json = {
      type: this.type,
      id: this.id,
      attributes: this.attributes,
    };

    if (this.relations && Object.values(this.relations).length) {
      json.relations = this.relations;
    }

    return json;
  }
}
