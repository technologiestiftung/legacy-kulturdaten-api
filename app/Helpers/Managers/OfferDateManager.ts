import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OfferDate from 'App/Models/Offer/OfferDate';
import { updateField, withTranslations } from 'App/Helpers/Utilities';
import { translation } from 'App/Validators/v1/OfferTranslationValidator';
import {
  CreateOfferDateValidator,
  UpdateOfferDateValidator,
  DeleteOfferDateValidator,
} from 'App/Validators/v1/OfferDateValidator';
import Offer from 'App/Models/Offer/Offer';
import Database from '@ioc:Adonis/Lucid/Database';
import { RRule } from 'rrule';
import { DateTime } from 'luxon';

export default class OfferDateManager extends BaseManager<typeof OfferDate> {
  public ManagedModel = OfferDate;

  public settings = {
    queryId: 'id',
    includables: [
      {
        name: 'offer',
        query: withTranslations,
      },
    ],
    orderableBy: [
      {
        name: 'createdAt',
        attribute: 'created_at',
      },
      {
        name: 'updatedAt',
        attribute: 'updated_at',
      },
      {
        name: 'startsAt',
        attribute: 'starts_at',
      },
      {
        name: 'endsAt',
        attribute: 'ends_at',
      },
    ],
    filters: [
      {
        name: 'past',
        query: (query, name, value) => {
          const now = DateTime.now().toISO();
          if (value === 'true') {
            return query.where('ends_at', '<', now);
          } else {
            return query.where('ends_at', '>=', now);
          }
        },
      },
    ],
  };

  public validators = {
    translation,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, OfferDate);
  }

  public query(
    options: { sort?: string; includes?: string; filter?: string } = {}
  ) {
    const query = super
      .query(options)
      .where(
        'offer_id',
        Database.from('offers')
          .select('id')
          .where('public_id', this.ctx.params.offer_id)
      );
    return query;
  }

  private async $getOfferById() {
    return Offer.findByOrFail('public_id', this.ctx.params.offer_id);
  }

  private async $createMany(offer: Offer, attributes, relations, meta) {
    console.log({ attributes, relations, meta });

    const rrule = RRule.fromString(meta.recurrenceRule);
    const duration = attributes.endsAt.diff(attributes.startsAt);

    const dates = rrule.all();
    const offerDates = await offer.related('dates').createMany(
      dates.map((ruleDate) => {
        const startsAt = DateTime.fromJSDate(ruleDate)
          .toUTC()
          .setZone('local', { keepLocalTime: true });
        const endsAt = startsAt.plus(duration);

        return Object.assign({}, attributes, { startsAt, endsAt });
      })
    );

    if (relations?.translations?.length) {
      await Database.transaction(async (trx) => {
        for (const offerDate of offerDates) {
          offerDate.useTransaction(trx);
          await this.$translate(offerDate);
          await offerDate.load('translations');
        }
      });
    }

    this.instances = offerDates;
    return this.instances;
  }

  public async create() {
    const { attributes, relations, meta } = await this.ctx.request.validate(
      new CreateOfferDateValidator(this.ctx)
    );

    const offer = await this.$getOfferById();
    if (meta?.recurrenceRule) {
      return this.$createMany(offer, attributes, relations, meta);
    }

    let offerDate;
    await Database.transaction(async (trx) => {
      offer.useTransaction(trx);
      offerDate = await offer.related('dates').create({
        startsAt: attributes.startsAt,
        endsAt: attributes.endsAt,
        hasBreaks: attributes.hasBreaks || false,
        needsRegistration: attributes.needsRegistration || false,
        hasFee: attributes.hasFee || false,
        ticketUrl: attributes.ticketUrl || undefined,
        registrationUrl: attributes.registrationUrl || undefined,
      });

      await this.$translate(offerDate);
      await offerDate.load('offer');
    });

    this.instance = offerDate;
    return this.instance;
  }

  public async update() {
    const { attributes } = await this.ctx.request.validate(
      new UpdateOfferDateValidator(this.ctx)
    );

    const offerDate = await this.byId();
    await Database.transaction(async (trx) => {
      offerDate.useTransaction(trx);

      updateField(attributes, offerDate, 'status');
      updateField(attributes, offerDate, 'needsRegistration');
      updateField(attributes, offerDate, 'hasFee');
      updateField(attributes, offerDate, 'ticketUrl');
      updateField(attributes, offerDate, 'registrationUrl');

      if (offerDate.$isDirty) {
        await offerDate.save();
      }

      await this.$translate(offerDate);
    });

    return this.instance;
  }

  public async delete() {
    const { attributes } = await this.ctx.request.validate(
      new DeleteOfferDateValidator(this.ctx)
    );

    return [...(await this.$deleteObject(OfferDate, attributes?.id))];
  }
}
