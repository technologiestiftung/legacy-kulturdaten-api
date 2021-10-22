import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import District from 'App/Models/District';

export default class DistrictManager extends BaseManager<typeof District> {
  public ModelClass = District;

  constructor(ctx: HttpContextContract) {
    super(ctx, District);
  }
}
