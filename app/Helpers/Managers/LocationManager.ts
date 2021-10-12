import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Location, {
  LocationTypes,
  PhysicalLocation,
} from 'App/Models/Location/Location';
import {
  CreatePhysicalLocationValidator,
  UpdatePhysicalLocationValidator,
  CreateVirtualLocationValidator,
  UpdateVirtualLocationValidator,
} from 'App/Validators/v1/LocationValidator';
import { translation } from 'App/Validators/v1/LocationTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import Address from 'App/Models/Address';
import Media from 'App/Models/Media';
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
    translation,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Location);
  }

  public query() {
    return super
      .query()
      .preload('physical', (query) => {
        return query.preload('address').preload('openingHours');
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

  private async $updateOpeningHours(
    physicalLocation: PhysicalLocation,
    openingHours
  ) {
    if (!openingHours.length) {
      return;
    }

    await physicalLocation.related('openingHours').createMany(
      openingHours.map((openingHour) => {
        return openingHour.attributes;
      })
    );
    await physicalLocation.load('openingHours');
  }

  private async $createPhysicalLocation() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreatePhysicalLocationValidator(this.ctx)
    );

    const location = new Location();
    await location.save();

    await location.related('physical').create({});
    await location.load('physical');

    if (relations?.address) {
      await this.$createAddress(
        location.physical,
        relations.address.attributes
      );
    }

    await this.$translate(location);
    await this.$updateLinks(location, relations?.links);
    await this.$updateTags(location, relations?.tags);
    await this.$updateOpeningHours(location.physical, relations?.openingHours);
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

      await location.related('virtual').create({ url: attributes.url });
      await location.load('virtual');

      await this.$translate(location);
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
    const location = this.instance;
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdatePhysicalLocationValidator(this.ctx)
    );

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

    await this.$translate(location);
    await this.$updateLinks(location, relations?.links);
    await this.$updateTags(location, relations?.tags);
    await this.$updateOpeningHours(location.physical, relations?.openingHours);
    await this.$storeMedia(location);

    return this.instance;
  }

  private async $updateVirtualLocation() {
    const location = this.instance;
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateVirtualLocationValidator(this.ctx)
    );

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

      await this.$translate(location);
      await this.$updateLinks(location, relations?.links);
      await this.$updateTags(location, relations?.tags);
      await this.$storeMedia(location);
    });

    return this.instance;
  }

  public async update() {
    await this.byId();
    if (this.instance.specific() instanceof PhysicalLocation) {
      return this.$updatePhysicalLocation();
    } else {
      return this.$updateVirtualLocation();
    }
  }

  public async delete() {
    const { attributes, relations } = await this.ctx.request.validate(
      new DeleteLocationValidator(this.ctx)
    );

    return [
      ...(await this.$deleteObjects(OrganizerContact, relations?.contacts)),
      ...(await this.$deleteObjects(Media, relations?.media)),
      ...(await this.$deleteObject(Location, attributes?.id, 'public_id')),
    ];
  }
}
