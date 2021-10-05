import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OfferDate from 'App/Models/OfferDate';
import { updateField, withTranslations } from 'App/Helpers/Utilities';
import { translation } from 'App/Validators/v1/OfferTranslationValidator';
import {
  CreateOfferDateValidator,
  UpdateOfferDateValidator,
} from 'App/Validators/v1/OfferDateValidator';
import Offer from 'App/Models/Offer';
import Database from '@ioc:Adonis/Lucid/Database';

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
    ],
  };

  public validators = {
    translation,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, OfferDate);
  }

  private async $findOffer() {
    return Offer.findByOrFail('public_id', this.ctx.params.offer_id);
  }

  public async create() {
    const { attributes } = await this.ctx.request.validate(
      new CreateOfferDateValidator(this.ctx)
    );

    const offer = await this.$findOffer();
    let offerDate;

    await Database.transaction(async (trx) => {
      offer.useTransaction(trx);
      offerDate = await offer.related('dates').create({
        startsAt: attributes.startsAt,
        endsAt: attributes.endsAt,
        needsRegistration: attributes.needsRegistration || false,
        hasFee: attributes.hasFee || false,
        ticketUrl: attributes.ticketUrl || undefined,
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

      if (offerDate.$isDirty) {
        await offerDate.save();
      }

      await this.$translate(offerDate);
    });

    return this.instance;
  }
}
