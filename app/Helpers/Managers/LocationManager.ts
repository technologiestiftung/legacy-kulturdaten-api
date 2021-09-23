import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Location, { LocationTypes } from 'App/Models/Location';
import {
  CreatePhysicalLocationValidator,
  UpdatePhysicalLocationValidator,
  CreateVirtualLocationValidator,
  UpdateVirtualLocationValidator,
} from 'App/Validators/v1/LocationValidator';
import { LocationTranslationValidator } from 'App/Validators/v1/LocationTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import Address from 'App/Models/Address';
import { withTranslations } from 'App/Helpers/Utilities';

export default class LocationManager extends BaseManager<typeof Location> {
  public ManagedModel = Location;

  public settings = {
    queryId: 'public_id',
    includables: [
      {
        name: 'organizer',
        query: withTranslations,
      },
      {
        name: 'tags',
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
    translate: LocationTranslationValidator,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Location);
  }

  public query() {
    return super
      .query()
      .preload('physical', (query) => {
        return query.preload('address');
      })
      .preload('virtual');
  }

  private async $createAddress(physicalLocation, attributes) {
    const address = new Address();
    address.fill(attributes);

    await address.save();
    await physicalLocation.related('address').associate(address);

    await physicalLocation.load('address');

    return address;
  }

  private async $createPhysicalLocation() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreatePhysicalLocationValidator(this.ctx)
    );

    const location = new Location();
    await location.save();

    await location.related('translations').create({
      name: attributes.name,
      description: attributes.description,
      language: this.language,
    });
    await location.load('translations');

    await location.related('physical').create({});
    await location.load('physical');

    if (relations?.address) {
      await this.$createAddress(
        location.physical,
        relations.address.attributes
      );
    }

    await this.$updateLinks(location, relations?.links);
    await this.$updateTags(location, relations?.tags);
    await this.$storeMedia(location);

    this.instance = location;
    return this.instance;
  }

  private async $createVirtualLocation() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateVirtualLocationValidator(this.ctx)
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
      await location.load('translations');

      await location.related('virtual').create({ url: attributes.url });
      await location.load('virtual');

      await this.$updateLinks(location, relations?.links);
      await this.$updateTags(location, relations?.tags);
      await this.$storeMedia(location);
    });

    this.instance = location;
    return this.instance;
  }

  public async create() {
    if (
      this.ctx.request.input('type', LocationTypes[LocationTypes.PHYSICAL]) ===
      LocationTypes.PHYSICAL
    ) {
      return this.$createPhysicalLocation();
    } else {
      return this.$createVirtualLocation();
    }
  }

  private async $updatePhysicalLocation() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdatePhysicalLocationValidator(this.ctx)
    );

    const location = await this.byId();

    location.status = attributes?.status || location.status;

    if (location.$isDirty) {
      await location.save();
    }

    if (relations?.address) {
      if (location.physical.address) {
        location.physical.address.merge(relations.address.attributes);
        await location.physical.address.save();
      } else {
        await this.$createAddress(
          location.physical,
          relations.address.attributes
        );
      }
    }

    await this.$updateLinks(location, relations?.links);
    await this.$updateTags(location, relations?.tags);
    await this.$storeMedia(location);

    return this.instance;
  }

  private async $updateVirtualLocation() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateVirtualLocationValidator(this.ctx)
    );

    const location = await this.byId();
    await Database.transaction(async (trx) => {
      location.useTransaction(trx);

      location.status = attributes?.status || location.status;
      if (location.$isDirty) {
        await location.save();
      }

      location.virtual.url = attributes?.url || location.virtual.url;

      if (location.virtual.$isDirty) {
        await location.virtual.save();
      }

      await this.$updateLinks(location, relations?.links);
      await this.$updateTags(location, relations?.tags);
      await this.$storeMedia(location);
    });

    return this.instance;
  }

  public async update() {
    if (
      this.ctx.request.input('type', LocationTypes.PHYSICAL) ===
      LocationTypes.PHYSICAL
    ) {
      return this.$updatePhysicalLocation();
    } else {
      return this.$updateVirtualLocation();
    }
  }

  public async translate() {
    const attributes = await this.$validateTranslation();

    // Creating an location translation without a name is forbidden,
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
