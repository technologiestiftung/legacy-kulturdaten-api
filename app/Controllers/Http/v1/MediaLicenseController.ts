import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import MediaLicense from 'App/Models/MediaLicense';
import MediaLicenseManager from 'App/Helpers/Managers/MediaLicenseManager';

export default class MediaLicenseController {
  public async index(ctx: HttpContextContract) {
    const manager = new MediaLicenseManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager = new MediaLicenseManager(ctx);
    await manager.byId();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
