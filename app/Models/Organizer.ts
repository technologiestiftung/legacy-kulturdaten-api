import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import Address from 'App/Models/Address';
import OrganizerType from 'App/Models/OrganizerType';
import OrganizerSubject from 'App/Models/OrganizerSubject';
import { validator } from '@ioc:Adonis/Core/Validator';
import { PublishOrganizerValidator } from 'App/Validators/v1/OrganizerValidator';
import { PublishOrganizerTranslationValidator } from 'App/Validators/v1/OrganizerTranslationValidator';
import Resource from 'App/Helpers/Api/Resource';
import Link from './Link';

export class OrganizerTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public organizerId: number;
}

export enum OrganizerStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export default class Organizer extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string;

  @column({ serializeAs: null })
  public publicId: string;

  @column()
  public status: string;

  public async publishable() {
    const resource = new Resource(this).boot().toObject();

    const errors = {};
    try {
      await validator.validate({
        schema: new PublishOrganizerValidator(this).schema,
        data: resource,
      });
    } catch (e) {
      Object.assign(errors, e.messages);
    }

    // Use an empty object to validate against, to force the error
    // even if there are no translations at all
    const translations = resource.relations?.translations || [{}];
    for (const translation of translations) {
      try {
        await validator.validate({
          schema: new PublishOrganizerTranslationValidator().schema,
          data: translation,
        });

        // Stop validating if there is only one valid
        // translation
        break;
      } catch (e) {
        Object.assign(errors, e.messages);
      }
    }

    return Object.keys(errors).length ? errors : true;
  }

  @column({ serializeAs: null })
  public addressId: number;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @column({ serializeAs: null })
  public organizerTypeId: number;

  @manyToMany(() => OrganizerType, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'organizer_public_id',
    pivotRelatedForeignKey: 'organizer_type_id',
    pivotTable: 'organizer_organizer_types',
  })
  public types: ManyToMany<typeof OrganizerType>;

  @manyToMany(() => OrganizerSubject, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'organizer_public_id',
    pivotRelatedForeignKey: 'organizer_subject_id',
    pivotTable: 'organizer_organizer_subjects',
  })
  public subjects: ManyToMany<typeof OrganizerSubject>;

  @hasMany(() => OrganizerTranslation)
  public translations: HasMany<typeof OrganizerTranslation>;

  @manyToMany(() => Link, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'organizer_public_id',
    pivotRelatedForeignKey: 'link_id',
    pivotTable: 'organizer_links',
  })
  public links: ManyToMany<typeof Link>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  // @manyToMany(() => User, {
  //   relatedKey: 'id',
  //   localKey: 'public_id',
  //   pivotForeignKey: 'organizer_public_id',
  //   pivotRelatedForeignKey: 'user_id',
  // })
  // public members: ManyToMany<typeof User>;

  @beforeCreate()
  public static async setPublicId(organizer: Organizer) {
    if (organizer.publicId) {
      return;
    }

    organizer.publicId = cuid();
  }
}
