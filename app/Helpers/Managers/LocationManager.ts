import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Location from 'App/Models/Location';
import {
  CreateLocationValidator,
  UpdateLocationValidator,
} from 'App/Validators/v1/LocationValidator';
import { LocationTranslationValidator } from 'App/Validators/v1/LocationTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import Address from 'App/Models/Address';

export default class LocationManager extends BaseManager<typeof Location> {
  public ManagedModel = Location;

  public settings = {
    queryId: 'public_id',
    orderableBy: [
      {
        name: 'name',
        query: Database.raw(
          `(SELECT name FROM organizer_translations WHERE organizer_translations.organizer_id = organizers.id AND organizer_translations.language = '${this.language}')`
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
    translate: LocationTranslationValidator,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Location);
  }

  public query() {
    return super.query().preload('address');
  }

  private async $createAddress(location, attributes, trx) {
    const address = new Address();
    await location.related();
    address.fill(attributes);

    address.useTransaction(trx);
    await address.save();
    await location.related('address').associate(address);

    return address;
  }

  public async create() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateLocationValidator(this.ctx)
    );

    const location = new Location();
    await Database.transaction(async (trx) => {
      location.useTransaction(trx);
      await location.save();

      await location.related('translations').create({
        name: attributes.name,
        description: attributes.description,
        language: this.language,
      });

      if (relations?.address) {
        await this.$createAddress(location, relations.address.attributes, trx);
      }

      await this.$updateLinks(location, relations?.links);
    });

    return await await this.byId(location.publicId);
  }

  public async update() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateLocationValidator(this.ctx)
    );

    const location = await this.byId();
    await Database.transaction(async (trx) => {
      location.useTransaction(trx);
      if (location.$isDirty) {
        await location.save();
      }

      if (relations?.address) {
        if (location.address) {
          location.address.merge(relations.address.attributes);
          await location.address.save();
        } else {
          await this.$createAddress(
            location,
            relations.address.attributes,
            trx
          );
        }
      }

      await this.$updateLinks(location, relations?.links);
    });

    return await this.byId(location.publicId);
  }

  public async translate() {
    const attributes = await this.$validateTranslation();

    // Creating an organizer translation without a name is forbidden,
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