import { BaseTransformer } from 'App/Helpers/Api/Transformers/BaseTransformer';
import {
  transformCategorizationsForXls,
  transformTranslationsForXls,
} from 'App/Helpers/Utilities';

export class OrganizerTransformer extends BaseTransformer {
  public run() {
    this.transformMany(
      ['relations.types', 'relations.subjects', 'relations.tags'],
      transformCategorizationsForXls,
      {
        format: 'xls',
      }
    );
    this.transformMany(
      [
        'relations.translations',
        'relations.types.[*].relations.translations',
        'relations.subjects.[*].relations.translations',
        'relations.tags.[*].relations.translations',
        'relations.contacts.[*].relations.translations',
      ],
      transformTranslationsForXls,
      {
        format: 'xls',
      }
    );
    this.stripMany(
      [
        'attributes.createdAt',
        'attributes.updatedAt',
        'relations.address.id',
        'relations.address.type',
        'relations.links.[*].id',
        'relations.links.[*].type',
        'relations.types.[*].id',
        'relations.types.[*].type',
        'relations.types.[*].relations.translations.[*].id',
        'relations.types.[*].relations.translations.[*].type',
        'relations.types.[*].relations.translations.[*].attributes.language',
        'relations.subjects.[*].id',
        'relations.subjects.[*].type',
        'relations.subjects.[*].relations.translations.[*].id',
        'relations.subjects.[*].relations.translations.[*].type',
        'relations.subjects.[*].relations.translations.[*].attributes.description',
        'relations.subjects.[*].relations.translations.[*].attributes.language',
        'relations.subjects.[*].relations.translations.[*].attributes.description',
        'relations.tags.[*].id',
        'relations.tags.[*].type',
        'relations.tags.[*].attributes.gndId',
        'relations.tags.[*].relations.translations.[*].id',
        'relations.tags.[*].relations.translations.[*].type',
        'relations.tags.[*].relations.translations.[*].attributes.language',
        'relations.contacts.[*].id',
        'relations.contacts.[*].type',
        'relations.contacts.[*].relations.translations.[*].id',
        'relations.contacts.[*].relations.translations.[*].type',
        'relations.contacts.[*].relations.translations.[*].attributes.language',
      ],
      {
        format: 'xls',
      }
    );

    return this.resource;
  }
}
