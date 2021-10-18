import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Location, { LocationStatus } from 'App/Models/Location/Location';
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
    await manager.byId();

    const location: Location = manager.instance;
    const publishable = await location.publishable();

    return new ApiDocument(ctx, manager.toResources(), { publishable });
  }

  public async update(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.update();

    const location = await manager.instance;
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

  public async destroy(ctx: HttpContextContract) {
    const manager = new LocationManager(ctx);
    return new ApiDocument(ctx, await manager.delete());
  }
}
