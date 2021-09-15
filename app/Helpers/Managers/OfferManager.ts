import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Offer from 'App/Models/Offer';
import {
  CreateOfferValidator,
  UpdateOfferValidator,
} from 'App/Validators/v1/OfferValidator';
import { OfferTranslationValidator } from 'App/Validators/v1/OfferTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import { withTranslations } from 'App/Helpers/Utilities';

export default class OfferManager extends BaseManager<typeof Offer> {
  public ManagedModel = Offer;

  public settings = {
    queryId: 'public_id',
    includables: [
      {
        name: 'dates',
      },
      {
        name: 'organizer',
        query: withTranslations,
      },
      {
        name: 'location',
        query: withTranslations,
      },
      { name: 'links' },
      {
        name: 'media',
        query: (query) => {
          withTranslations(query);
          query.preload('renditions');
        },
      },
    ],
    orderableBy: [
      {
        name: 'name',
        query: Database.raw(
          `(SELECT name FROM location_translations WHERE location_translations.location_id = locations.id AND location_translations.language = '${this.language}')`
        ),
      },
      {
        name: 'createdAt',
        attribute: 'created_at',
      },
      {
        name: 'updatedAt',
        attribute: 'updated_at',
      },
    ],
  };

  public validators = {
    translate: OfferTranslationValidator,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Offer);
  }

  public query() {
    return super.query().preload('dates', withTranslations);
  }

  public async create() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateOfferValidator(this.ctx)
    );

    const offer = new Offer();
    await Database.transaction(async (trx) => {
      offer.useTransaction(trx);
      await offer.save();

      await offer.related('translations').create({
        name: attributes.name,
        description: attributes.description,
        language: this.language,
      });
      await offer.load('translations');

      await this.$updateLinks(offer, relations?.links);
      await this.$storeMedia(offer);
    });

    this.instance = offer;
    return this.instance;
  }

  public async update() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateOfferValidator(this.ctx)
    );

    const offer = await this.byId();
    await Database.transaction(async (trx) => {
      offer.useTransaction(trx);
      offer.recurrenceRule = attributes.recurrenceRule
        ? attributes.recurrenceRule
        : offer.recurrenceRule;
      if (offer.$isDirty) {
        await offer.save();
      }

      await this.$updateLinks(offer, relations?.links);
      await this.$storeMedia(offer);
    });

    return this.instance;
  }

  public async translate() {
    const attributes = await this.$validateTranslation();

    // Creating an offer translation without a name is forbidden,
    // but initially creating one without a name is impossible. Hence fallback
    // to the initial name
    if (!attributes.name) {
      attributes.name = this.instance?.translations?.find((translation) => {
        return translation.name;
      })?.name;
    }

    await this.$saveTranslation(attributes);

    return this.byId();
  }
}
