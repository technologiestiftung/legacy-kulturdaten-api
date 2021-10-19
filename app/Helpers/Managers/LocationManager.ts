import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Location, { LocationStatus } from 'App/Models/Location/Location';
import {
  CreateLocationValidator,
  UpdateLocationValidator,
  DeleteLocationValidator,
} from 'App/Validators/v1/LocationValidator';
import { translation } from 'App/Validators/v1/LocationTranslationValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import Address from 'App/Models/Address';
import { withTranslations, updateField } from 'App/Helpers/Utilities';
import { Accessibility, OpeningHours } from 'App/Models/Location';
import Media from 'App/Models/Media';

export default class LocationManager extends BaseManager<typeof Location> {
  public ManagedModel = Location;

  public settings = {
    queryId: 'public_id',
    includables: [
      { name: 'openingHours' },
      { name: 'address' },
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
      {
        name: 'accessibility',
        query: (query) => {
          query.preload('fields');
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
    filters: [
      {
        name: 'status',
        query: (query, name, value) => {
          if (
            ![LocationStatus.DRAFT, LocationStatus.PUBLISHED].includes(value)
          ) {
            return query;
          }

          return query.where('status', 'LIKE', value);
        },
      },
      {
        name: 'organizer',
        query: (query, name, value) => {
          return query.whereHas('organizer', (organizersQuery) => {
            organizersQuery.where('public_id', value);
          });
        },
      },
    ],
  };

  public validators = {
    translation,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Location);
  }

  private async $createAddress(location, attributes) {
    if (!attributes) {
      return;
    }

    const address = new Address();
    address.fill(attributes);

    await address.save();
    await location.related('address').associate(address);

    await location.load('address');

    return address;
  }

  public async create() {
    const { attributes, relations } = await this.ctx.request.validate(
      new CreateLocationValidator(this.ctx)
    );

    const location = new Location();
    updateField(attributes, location, 'status');
    updateField(attributes, location, 'type');
    updateField(attributes, location, 'url');
    if (relations?.organizer) {
      location.organizerId = relations!.organizer;
    }
    await location.save();

    await this.$createAddress(location, relations?.address?.attributes);

    await this.$translate(location);
    await this.$updateLinks(location, relations?.links);
    await this.$updateTags(location, relations?.tags);
    await this.$updateMany(location, 'openingHours', relations?.openingHours);
    await this.$storeMedia(location);

    // Create an accessibility object to hold a11y info separate
    // from all the basic location logic
    await Accessibility.create({
      locationId: location.publicId,
    });
    await location.load('accessibility');

    this.instance = location;
    return this.instance;
  }

  public async update() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateLocationValidator(this.ctx)
    );

    const location = await this.byId();
    updateField(attributes, location, 'status');
    updateField(attributes, location, 'type');
    updateField(attributes, location, 'url');
    if (relations?.organizer) {
      location.organizerId = relations!.organizer;
    }
    if (location.$isDirty) {
      await location.save();
    }

    if (relations?.address) {
      if (location.address) {
        location.address.merge(relations.address.attributes);
        await location.address.save();
      } else {
        await this.$createAddress(location, relations.address.attributes);
      }
    }

    await this.$translate(location);
    await this.$updateLinks(location, relations?.links);
    await this.$updateTags(location, relations?.tags);
    await this.$updateMany(location, 'openingHours', relations?.openingHours);
    await this.$storeMedia(location);

    return this.instance;
  }

  public async delete() {
    const { attributes, relations } = await this.ctx.request.validate(
      new DeleteLocationValidator(this.ctx)
    );

    return [
      ...(await this.$deleteObject(Location, attributes?.id, 'public_id')),
      ...(await this.$deleteObject(Address, relations?.address)),
      ...(await this.$deleteObjects(OpeningHours, relations?.openingHours)),
      ...(await this.$deleteObjects(Media, relations?.media)),
    ];
  }
}
