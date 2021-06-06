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
import User from 'App/Models/User';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import Address from 'App/Models/Address';
import OrganizerType from 'App/Models/OrganizerType';
import OrganizerSubject from 'App/Models/OrganizerSubject';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';

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
  public static resourceClass = OrganizerResource;

  @column({ isPrimary: true, serializeAs: null })
  public id: string;

  @column()
  public publicId: string;

  @column()
  public status: string;


  @column({ serializeAs: null })
  public addressId: number;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @column({ serializeAs: null })
  public organizerTypeId: number;

  @belongsTo(() => OrganizerType)
  public type: BelongsTo<typeof OrganizerType>;

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
