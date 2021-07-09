import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Location, { LocationStatus } from 'App/Models/Location';
import LocationManager from 'App/Helpers/Managers/LocationManager';

// TODO(matthiasrohmer): Add permissions
export default class LocationController {
  public async index(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
    });
  }

  public async store(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.create();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);

    manager.include = 'address,types,subjects';
    await manager.byId();

    const location: Location = manager.instance;
    const publishable = await location.publishable();

    return new ApiDocument(ctx, manager.toResources(), { publishable });
  }

  public async update(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.update();

    manager.include = 'address,types,subjects';
    const location: Location = await manager.byId();
    const publishable = await location.publishable();

    if (publishable !== true) {
      location.status = LocationStatus.DRAFT;
      if (location.$isDirty) {
        await location.save();
      }
    }

    return new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
  }

  public async translate(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.byId();
    await manager.translate();

    return new ApiDocument(ctx, manager.toResources());
  }

  // public async destroy(ctx: HttpContextContract) {
  //   const { params, auth } = ctx;
  //   if (!auth.user) {
  //     throw new UnauthorizedException();
  //   }

  //   const location = await Location.query()
  //     .preload('address')
  //     .where('cid', params.id)
  //     .firstOrFail();
  //   const address = location.address;

  //   await Promise.all([location.delete(), address.delete()]);

  //   return new ApiDocument(ctx, {}, 'Location deleted successfully');
  // }
}
