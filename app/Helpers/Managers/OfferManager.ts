import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Offer, { OfferStatus } from 'App/Models/Offer/Offer';
import { OfferContributor, OfferDate, Audience } from 'App/Models/Offer';
import Media from 'App/Models/Media';
import {
  CreateOfferValidator,
  UpdateOfferValidator,
  DeleteOfferValidator,
} from 'App/Validators/v1/OfferValidator';
import { translation } from 'App/Validators/v1/OfferTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import {
  withTranslations,
  updateField,
  queryMedia,
} from 'App/Helpers/Utilities';
import { RRule } from 'rrule';
import { DateTime } from 'luxon';

export default class OfferManager extends BaseManager<typeof Offer> {
  public ManagedModel = Offer;

  public settings = {
    queryId: 'public_id',
    includables: [
      {
        name: 'contributors',
        query: (query) => {
          query.preload('translations').preload('organizer', withTranslations);
        },
      },
      {
        name: 'dates',
        query: withTranslations,
      },
      {
        name: 'organizers',
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
        name: 'mainType',
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
        query: queryMedia,
      },
      {
        name: 'audience',
        query: (query) => {
          query.preload('fields');
        },
      },
      { name: 'peakHours' },
    ],
    filters: [
      {
        name: 'status',
        query: (query, name, value) => {
          if (![OfferStatus.DRAFT, OfferStatus.PUBLISHED].includes(value)) {
            return query;
          }

          return query.where('status', 'LIKE', value);
        },
      },
      {
        name: 'organizers',
        query: (query, name, value) => {
          const publicIds = value.split(',');
          query = query.whereHas('organizers', (organizersQuery) => {
            organizersQuery.whereIn('public_id', publicIds);
          });

          return query;
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

  private async $updateContributors(offer, contributors: any[] = []) {
    return this.$updateMany(
      offer,
      'contributors',
      contributors.map((contributor) => {
        if (!contributor.relations?.organizer) {
          return contributor;
        }

        contributor.attributes = {
          organizerId: contributor.relations!.organizer,
        };
        delete contributor.relations.organizer;

        return contributor;
      }),
      (contributorsQuery) =>
        contributorsQuery
          .preload('translations')
          .preload('organizer', withTranslations)
    );
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
      offer.registrationUrl = attributes?.registrationUrl || '';
      if (relations?.location) {
        offer.locationId = relations!.location;
      }

      await offer.save();

      if (relations?.location) {
        await offer.load('location');
      }

      await this.$translate(offer);
      await this.$updateDates(offer, meta);

      await this.$updateManyToMany(offer, 'organizers', relations?.organizers);

      await this.$updateManyToMany(offer, 'mainType', relations?.mainType);
      await this.$updateManyToMany(offer, 'types', relations?.types);
      await this.$updateManyToMany(offer, 'subjects', relations?.subjects);

      await this.$updateLinks(offer, relations?.links);
      await this.$updateTags(offer, relations?.tags);
      await this.$storeMedia(offer);
    });

    await this.$updateContributors(offer, relations?.contributors);
    await this.$updateMany(offer, 'peakHours', relations?.peakHours);

    // Create an audience object to hold additional
    // info separate from all the basic offer logic
    await Audience.create({
      offerId: offer.publicId,
    });
    await offer.load('audience');

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
      updateField(attributes, offer, 'registrationUrl');
      if (relations?.location) {
        offer.locationId = relations!.location;
      }
      if (offer.$isDirty) {
        await offer.save();
      }

      await this.$translate(offer);
      await this.$updateDates(offer, meta);

      await this.$updateManyToMany(offer, 'organizers', relations?.organizers);

      await this.$updateManyToMany(offer, 'mainType', relations?.mainType);
      await this.$updateManyToMany(offer, 'types', relations?.types);
      await this.$updateManyToMany(offer, 'subjects', relations?.subjects);

      await this.$updateLinks(offer, relations?.links);
      await this.$updateTags(offer, relations?.tags);
      await this.$storeMedia(offer);
    });

    await this.$updateMany(offer, 'contributors', relations?.contributors);
    await this.$updateMany(offer, 'peakHours', relations?.peakHours);

    return this.instance;
  }

  public async delete() {
    const { attributes, relations } = await this.ctx.request.validate(
      new DeleteOfferValidator(this.ctx)
    );

    return [
      ...(await this.$deleteObjects(OfferDate, relations?.dates)),
      ...(await this.$deleteObjects(OfferContributor, relations?.contributors)),
      ...(await this.$deleteObjects(Media, relations?.media)),
      ...(await this.$deleteObject(Offer, attributes?.id, 'public_id')),
    ];
  }
}
