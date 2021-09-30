import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OfferDate from 'App/Models/OfferDate';
import { updateField, withTranslations } from 'App/Helpers/Utilities';
import { OfferTranslationValidator } from 'App/Validators/v1/OfferTranslationValidator';
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
    translate: OfferTranslationValidator,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, OfferDate);
  }

  private async $findOffer() {
    console.log(this.ctx.params.offer_id);
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

      await offerDate.related('translations').create({
        name: attributes.name,
        description: attributes.description,
        language: this.language,
      });

      await offerDate.load('translations');
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
    });

    return this.instance;
  }

  public async translate() {
    const attributes = await this.$validateTranslation();

    // Offer dates may not have any translation but soleley rely on their
    // parents data, hence load the translations of the parent if no
    // name is given
    if (!attributes.name) {
      const offer = await this.$findOffer();
      await offer.load('translations');

      attributes.name = offer.translations?.find((translation) => {
        return translation.name;
      })?.name;
    }

    await this.$saveTranslation(attributes);

    return this.byId();
  }
}
