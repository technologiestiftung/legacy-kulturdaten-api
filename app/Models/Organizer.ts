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
import { PublishOrganizerValidator } from 'App/Validators/v1/OrganizerValidator';
import { PublishOrganizerTranslationValidator } from 'App/Validators/v1/OrganizerTranslationValidator';
import Link from 'App/Models/Link';
import { publishable } from 'App/Helpers/Utilities';

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
    return publishable(
      this,
      PublishOrganizerValidator,
      PublishOrganizerTranslationValidator
    );
  }

  @column({ serializeAs: null })
  public addressId: number;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @column()
  public email: string;

  @column()
  public phone: string;

  @column()
  public homepage: string;

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

  public static findByType(organizerType: organizerType) {
    return Organizer.query().whereHas('types', (query) => {
      query.where('organizer_type_id', '=', organizerType.id);
    });
  }
}
