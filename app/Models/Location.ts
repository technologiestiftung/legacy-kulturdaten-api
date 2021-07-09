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
import { PublishLocationValidator } from 'App/Validators/v1/LocationValidator';
import { PublishLocationTranslationValidator } from 'App/Validators/v1/LocationTranslationValidator';
import Address from 'App/Models/Address';
import Link from 'App/Models/Link';
import { publishable } from 'App/Helpers/Utilities';

export class LocationTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column({ serializeAs: null })
  public locationId: number;
}

export enum LocationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export default class Location extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string;

  @column({ serializeAs: null })
  public publicId: string;

  @column()
  public status: string;

  @column({ serializeAs: null })
  public addressId: number;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @hasMany(() => LocationTranslation)
  public translations: HasMany<typeof LocationTranslation>;

  @manyToMany(() => Link, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'location_public_id',
    pivotRelatedForeignKey: 'link_id',
    pivotTable: 'location_links',
  })
  public links: ManyToMany<typeof Link>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public async publishable() {
    return publishable(
      this,
      PublishLocationValidator,
      PublishLocationTranslationValidator
    );
  }

  @beforeCreate()
  public static async setPublicId(location: Location) {
    if (location.publicId) {
      return;
    }

    location.publicId = cuid();
  }
}
