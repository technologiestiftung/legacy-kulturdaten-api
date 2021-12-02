import { BaseTransformer } from 'App/Helpers/Api/Transformers/BaseTransformer';

export class OfferTransformer extends BaseTransformer {
  public run() {
    this.stripMany(
      [
        'type',
        'attributes.createdAt',
        'attributes.updatedAt',
        'relations.translations.[*].id',
        'relations.translations.[*].type',
        'relations.translations.[*].attributes.language',
        'relations.organizers.[*].id',
        'relations.organizers.[*].type',
        'relations.organizers.[*].attributes',
        'relations.organizers.[*].relations.translations.[*].id',
        'relations.organizers.[*].relations.translations.[*].type',
        'relations.organizers.[*].relations.translations.[*].attributes.language',
        'relations.organizers.[*].relations.translations.[*].attributes.description',
        'relations.contributors.[*].id',
        'relations.contributors.[*].type',
        'relations.contributors.[*].subtype.type',
        'relations.contributors.[*].subtype.id',
        'relations.contributors.[*].relations.translations.[*].id',
        'relations.contributors.[*].relations.translations.[*].type',
        'relations.contributors.[*].relations.translations.[*].attributes.language',
        'relations.contributors.[*].relations.translations.[*].attributes.description',
        'relations.contributors.[*].attributes.status',
        'relations.contributors.[*].attributes.homepage',
        'relations.contributors.[*].attributes.email',
        'relations.contributors.[*].attributes.phone',
        'relations.contributors.[*].attributes.createdAt',
        'relations.contributors.[*].attributes.updatedAt',
        'relations.media.[*].attributes.filesize',
        'relations.media.[*].attributes.acceptedTermsAt',
        'relations.media.[*].relations.renditions.[*].attributes.filesize',
        'relations.location.attributes.status',
        'relations.location.attributes.rentUrl',
        'relations.location.attributes.createdAt',
        'relations.location.attributes.updatedAt',
        'relations.location.relations.translations.[*].attributes.description',
        'relations.dates.[*].id',
        'relations.dates.[*].type',
        'relations.dates.[*].relations.translations.[*].id',
        'relations.dates.[*].relations.translations.[*].type',
        'relations.dates.[*].relations.translations.[*].attributes.language',
        'relations.audience.id',
        'relations.audience.type',
      ],
      {
        format: 'xls',
      }
    );

    return this.resource;
  }
}
