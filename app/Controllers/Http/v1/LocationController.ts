import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Location, { LocationStatus } from 'App/Models/Location/Location';
import LocationManager from 'App/Helpers/Managers/LocationManager';
import { LocationTransformer } from 'App/Helpers/Api/Transformers/LocationTransformer';

// TODO(matthiasrohmer): Add permissions
export default class LocationController {
  public async index(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources(), {
      paginator: manager.paginator,
      transformer: LocationTransformer,
    });
  }

  public async store(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.create();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.byId();

    const location: Location = manager.instance;
    const publishable = await location.publishable();

    const document = new ApiDocument(ctx, manager.toResources(), {
      publishable,
      transformer: LocationTransformer,
    });
    await document.send();
  }

  public async update(ctx: HttpContextContract) {
    const manager: LocationManager = new LocationManager(ctx);
    await manager.update();

    const location = manager.instance;
    const publishable = await location.publishable();
    if (publishable !== true) {
      location.status = LocationStatus.DRAFT;
      if (location.$isDirty) {
        await location.save();
      }
    }

    const document = new ApiDocument(ctx, manager.toResources(), {
      publishable,
    });
    await document.send();
  }

  public async destroy(ctx: HttpContextContract) {
    const manager = new LocationManager(ctx);

    const document = new ApiDocument(ctx, await manager.delete());
    await document.send();
  }
}
