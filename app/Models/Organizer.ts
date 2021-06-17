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
  computed,
} from '@ioc:Adonis/Lucid/Orm';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import Address from 'App/Models/Address';
import OrganizerType from 'App/Models/OrganizerType';
import OrganizerSubject from 'App/Models/OrganizerSubject';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';
import { validator, schema } from '@ioc:Adonis/Core/Validator';
import { PublishOrganizerValidator } from 'App/Validators/v1/OrganizerValidator';

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
    const resource = new OrganizerResource(this);
    resource.boot();

    try {
      await validator.validate({
        schema: new PublishOrganizerValidator(this).schema,
        data: resource.toObject(),
      });
    } catch (e) {
      return e.messages;
    }

    return true;
  }

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
