import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Offer from 'App/Models/Offer/Offer';
import {
  CreateOfferValidator,
  UpdateOfferValidator,
} from 'App/Validators/v1/OfferValidator';
import { translation } from 'App/Validators/v1/OfferTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import { withTranslations, updateField } from 'App/Helpers/Utilities';
import { RRule } from 'rrule';
import { DateTime } from 'luxon';

export default class OfferManager extends BaseManager<typeof Offer> {
  public ManagedModel = Offer;

  public settings = {
    queryId: 'public_id',
    includables: [
      {
        name: 'dates',
        query: withTranslations,
      },
      {
        name: 'organizer',
        query: withTranslations,
      },
      {
        name: 'location',
        query: withTranslations,
      },
      {
        name: 'tags',
        query: withTranslations,
      },
      {
        name: 'types',
        query: withTranslations,
      },
      {
        name: 'subjects',
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
          `(SELECT name FROM offer_translations WHERE offer_translations.offer_id = offers.id AND offer_translations.language = '${this.language}')`
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
    translation,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Offer);
  }

  public query() {
    return super.query().preload('dates', withTranslations);
  }

  private async $updateDates(
    offer: Offer,
    meta:
      | { recurrenceRule: string; startsAt: DateTime; endsAt: DateTime }
      | undefined
  ) {
    if (!meta) {
      return;
    }

    const rrule = RRule.fromString(meta.recurrenceRule);
    const duration = meta.endsAt.diff(meta.startsAt);

    const dates = rrule.all();
    await offer.related('dates').createMany(
      dates.map((ruleDate) => {
        const startsAt = DateTime.fromJSDate(ruleDate)
          .toUTC()
          .setZone('local', { keepLocalTime: true });
        const endsAt = startsAt.plus(duration);

        return {
          startsAt,
          endsAt,
        };
      })
    );

    await offer.load('dates', withTranslations);
  }

  private async $updateTypes(offer: Offer, types) {
    if (types) {
      await offer.related('types').sync(types);
      await offer.load('types', withTranslations);
    }
  }

  private async $updateSubjects(offer: Offer, subjects) {
    if (subjects) {
      await offer.related('subjects').sync(subjects);
      await offer.load('subjects', withTranslations);
    }
  }

  public async create() {
    const { attributes, relations, meta } = await this.ctx.request.validate(
      new CreateOfferValidator(this.ctx)
    );

    const offer = new Offer();
    await Database.transaction(async (trx) => {
      offer.useTransaction(trx);

      offer.needsRegistration = attributes?.needsRegistration || false;
      offer.hasFee = attributes?.hasFee || false;
      offer.isPermanent = attributes?.isPermanent || false;
      offer.ticketUrl = attributes?.ticketUrl || '';

      await offer.save();

      await this.$translate(offer);
      await this.$updateDates(offer, meta);
      await this.$updateSubjects(offer, relations?.subjects);
      await this.$updateTypes(offer, relations?.types);
      await this.$updateLinks(offer, relations?.links);
      await this.$updateTags(offer, relations?.tags);
      await this.$storeMedia(offer);
    });

    this.instance = offer;
    return this.instance;
  }

  public async update() {
    const { attributes, relations, meta } = await this.ctx.request.validate(
      new UpdateOfferValidator(this.ctx)
    );

    const offer = await this.byId();
    await Database.transaction(async (trx) => {
      offer.useTransaction(trx);

      updateField(attributes, offer, 'status');
      updateField(attributes, offer, 'needsRegistration');
      updateField(attributes, offer, 'hasFee');
      updateField(attributes, offer, 'isPermanent');
      updateField(attributes, offer, 'ticketUrl');

      if (offer.$isDirty) {
        await offer.save();
      }

      await this.$translate(offer);
      await this.$updateDates(offer, meta);
      await this.$updateSubjects(offer, relations?.subjects);
      await this.$updateTypes(offer, relations?.types);
      await this.$updateLinks(offer, relations?.links);
      await this.$updateTags(offer, relations?.tags);
      await this.$storeMedia(offer);
    });

    return this.instance;
  }
}
