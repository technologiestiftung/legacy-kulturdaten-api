import { LucidRow } from '@ioc:Adonis/Lucid/Model';

export class ApiResource {
  static create(data: LucidRow | Array<LucidRow>) {
    if (Array.isArray(data)) {
      return data.map((model) => {
        return new ApiResource(model);
      });
    }

    return new ApiResource(data);
  }

  constructor(model: LucidRow) {
    this.model = model;
    this.type = model.constructor.name.toLowerCase();
    this.id = model.primaryKey;

    this.attributes = model.serializeAttributes();
  }

  toJSON() {
    return {
      type: this.type,
      id: this.id,
      attributes: this.attributes,
    };
  }
}
