import { BaseTransformer } from 'App/Helpers/Api/Transformers/BaseTransformer';

export class OfferTransformer extends BaseTransformer {
  public run() {
    this.stripMany(
      [
        'relations.translations.[*].id',
        'relations.translations.[*].type',
        'relations.contributors.[*].relations.translations.[*].attributes.name',
      ],
      {
        format: 'xls',
      }
    );

    return this.resource;
  }
}
