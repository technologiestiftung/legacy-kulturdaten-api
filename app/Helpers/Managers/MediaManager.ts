import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Media from 'App/Models/Media';
import { MediaTranslationValidator } from 'App/Validators/v1/MediaTranslationValidator';
import { UpdateMediaValidator } from 'App/Validators/v1/MediaValidator';
import Database from '@ioc:Adonis/Lucid/Database';

export default class MediaManager extends BaseManager<typeof Media> {
  public ModelClass = Media;

  public validators = {
    translate: MediaTranslationValidator,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Media);
  }

  public query() {
    return super.query().preload('renditions');
  }

  public async update() {
    const { attributes } = await this.ctx.request.validate(
      new UpdateMediaValidator(this.ctx)
    );

    const media = await this.byId();
    await Database.transaction(async (trx) => {
      media.useTransaction(trx);

      media.copyright = attributes?.copyright || media.copyright;
      media.license = attributes?.license || media.license;
      media.expiresAt = attributes?.expiresAt || media.expiresAt;

      if (media.$isDirty) {
        await media.save();
      }
    });

    return this.instance;
  }
}
