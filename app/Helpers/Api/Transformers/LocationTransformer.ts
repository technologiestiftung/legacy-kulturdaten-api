import { BaseTransformer } from 'App/Helpers/Api/Transformers/BaseTransformer';

export class LocationTransformer extends BaseTransformer {
  public run() {
    this.stripMany(
      ['relations.translations.[*].id', 'relations.translations.[*].type'],
      {
        format: 'xls',
      }
    );

    return this.resource;
  }
}
