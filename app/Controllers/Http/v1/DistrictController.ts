import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { ApiDocument } from 'App/Helpers/Api/Document';
import District from 'App/Models/District';
import DistrictManager from 'App/Helpers/Managers/DistrictManager';

export default class DistrictController {
  public async index(ctx: HttpContextContract) {
    const manager = new DistrictManager(ctx);
    await manager.all();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const manager = new DistrictManager(ctx);
    await manager.byId();

    const document = new ApiDocument(ctx, manager.toResources());
    await document.send();
  }
}
