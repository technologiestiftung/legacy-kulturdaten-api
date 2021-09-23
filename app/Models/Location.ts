import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
  beforeCreate,
} from '@ioc:Adonis/Lucid/Orm';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import {
  PublishPhysicalLocationValidator,
  PublishVirtualLocationValidator,
} from 'App/Validators/v1/LocationValidator';
import { PublishLocationTranslationValidator } from 'App/Validators/v1/LocationTranslationValidator';
import Address from 'App/Models/Address';
import Link from 'App/Models/Link';
import Media from 'App/Models/Media';
import Organizer from 'App/Models/Organizer';
import Tag from 'App/Models/Tag';
import { publishable } from 'App/Helpers/Utilities';

export class PhysicalLocation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string;

  @column({ serializeAs: null })
  public addressId: number;

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>;

  @column({ serializeAs: null })
  public locationId: number;
}

export class VirtualLocation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: string;

  @column()
  public url: string;

  @column({ serializeAs: null })
  public locationId: number;
}

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

export enum LocationTypes {
  VIRTUAL = 'virtuallocation',
  PHYSICAL = 'physicallocation',
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
  public organizerId: number;

  @belongsTo(() => Organizer)
  public organizer: BelongsTo<typeof Organizer>;

  @hasMany(() => LocationTranslation)
  public translations: HasMany<typeof LocationTranslation>;

  @hasOne(() => VirtualLocation)
  public virtual: HasOne<typeof VirtualLocation>;

  @hasOne(() => PhysicalLocation)
  public physical: HasOne<typeof PhysicalLocation>;

  @manyToMany(() => Link, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'location_public_id',
    pivotRelatedForeignKey: 'link_id',
    pivotTable: 'location_links',
  })
  public links: ManyToMany<typeof Link>;

  @manyToMany(() => Media, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'location_public_id',
    pivotRelatedForeignKey: 'media_id',
    pivotTable: 'location_media',
  })
  public media: ManyToMany<typeof Media>;

  @manyToMany(() => Tag, {
    relatedKey: 'id',
    localKey: 'publicId',
  })
  public tags: ManyToMany<typeof Tag>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public specific() {
    return this.virtual || this.physical || undefined;
  }

  public async publishable() {
    if (this.virtual) {
      return publishable(
        this,
        PublishVirtualLocationValidator,
        PublishLocationTranslationValidator
      );
    }

    if (this.physical) {
      return publishable(
        this,
        PublishPhysicalLocationValidator,
        PublishLocationTranslationValidator
      );
    }

    return false;
  }

  @beforeCreate()
  public static async setPublicId(location: Location) {
    if (location.publicId) {
      return;
    }

    location.publicId = cuid();
  }
}
