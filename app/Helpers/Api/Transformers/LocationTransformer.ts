import { BaseTransformer } from 'App/Helpers/Api/Transformers/BaseTransformer';
import { transformTranslationsForXls } from 'App/Helpers/Utilities';

export class LocationTransformer extends BaseTransformer {
  public async run() {
    await this.transformMany(
      ['relations.translations'],
      transformTranslationsForXls,
      {
        format: 'xls',
      }
    );
    await this.stripMany(
      [
        'attributes.createdAt',
        'attributes.updatedAt',
        'relations.translations.[*].attributes.language',
        'relations.address.id',
        'relations.address.type',
        'relations.service.id',
        'relations.service.type',
        'relations.service.relations.fields.[*].id',
        'relations.service.relations.fields.[*].type',
        'relations.service.relations.fields.[*].attributes.type',
        'relations.accessibility.id',
        'relations.accessibility.type',
        'relations.accessibility.relations.fields.[*].id',
        'relations.accessibility.relations.fields.[*].type',
        'relations.accessibility.relations.fields.[*].attributes.type',
        'relations.openingHours.[*].id',
        'relations.openingHours.[*].type',
      ],
      {
        format: 'xls',
      }
    );

    return this.resource;
  }
}
