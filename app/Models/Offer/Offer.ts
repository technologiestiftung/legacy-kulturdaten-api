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
import { PublishOfferValidator } from 'App/Validators/v1/OfferValidator';
import { PublishOfferTranslationValidator } from 'App/Validators/v1/OfferTranslationValidator';
import Organizer from 'App/Models/Organizer/Organizer';
import Location from 'App/Models/Location';
import Link from 'App/Models/Link';
import Media from 'App/Models/Media';
import OfferDate from 'App/Models/OfferDate';
import { OfferType, OfferSubject } from 'App/Models/Offer';
import { publishable } from 'App/Helpers/Utilities';
import Tag from 'App/Models/Tag';

export class OfferTranslation extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public language: string;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public roomDescription: string;

  @column({ serializeAs: null })
  public offerId: number;
}

export enum OfferStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export default class Offer extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column({ serializeAs: null })
  public publicId: string;

  @column()
  public status: string;

  @column()
  public isPermanent: boolean;

  @column()
  public hasFee: boolean;

  @column()
  public needsRegistration: boolean;

  @column()
  public ticketUrl: string;

  @column({ serializeAs: null })
  public organizerId: number;

  @belongsTo(() => Organizer)
  public organizer: BelongsTo<typeof Organizer>;

  @column({ serializeAs: null })
  public locationId: number;

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>;

  @hasMany(() => OfferTranslation)
  public translations: HasMany<typeof OfferTranslation>;

  @hasMany(() => OfferDate)
  public dates: HasMany<typeof OfferDate>;

  @manyToMany(() => Link, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'offer_public_id',
    pivotRelatedForeignKey: 'link_id',
    pivotTable: 'offer_links',
  })
  public links: ManyToMany<typeof Link>;

  @manyToMany(() => Media, {
    relatedKey: 'id',
    localKey: 'publicId',
    pivotForeignKey: 'offer_public_id',
    pivotRelatedForeignKey: 'media_id',
    pivotTable: 'offer_media',
  })
  public media: ManyToMany<typeof Media>;

  @manyToMany(() => Tag)
  public tags: ManyToMany<typeof Tag>;

  @manyToMany(() => OfferType)
  public types: ManyToMany<typeof OfferType>;

  @manyToMany(() => OfferSubject)
  public subjects: ManyToMany<typeof OfferSubject>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public async publishable() {
    return publishable(
      this,
      PublishOfferValidator,
      PublishOfferTranslationValidator
    );
  }

  @beforeCreate()
  public static async setPublicId(offer: Offer) {
    if (offer.publicId) {
      return;
    }

    offer.publicId = cuid();
  }
}
