import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import MediaLicense from 'App/Models/MediaLicense';
import MediaLicenseManager from 'App/Helpers/Managers/MediaLicenseManager';

export default class MediaLicenseController {
  public async index(ctx: HttpContextContract) {
    const manager = new MediaLicenseManager(ctx);
    await manager.all();

    return new ApiDocument(ctx, manager.toResources());
  }

  public async show(ctx: HttpContextContract) {
    const manager = new MediaLicenseManager(ctx);

    await manager.byId();
    return new ApiDocument(ctx, manager.toResources());
  }
}
