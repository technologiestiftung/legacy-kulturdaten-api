import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import MediaLicense from 'App/Models/MediaLicense';

export default class MediaLicenseManager extends BaseManager<
  typeof MediaLicense
> {
  public ModelClass = MediaLicense;

  constructor(ctx: HttpContextContract) {
    super(ctx, MediaLicense);
  }
}
