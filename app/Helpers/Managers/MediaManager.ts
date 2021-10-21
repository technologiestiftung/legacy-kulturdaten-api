import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Media from 'App/Models/Media';
import { translation } from 'App/Validators/v1/MediaTranslationValidator';
import {
  UpdateMediaValidator,
  DeleteMediaValidator,
} from 'App/Validators/v1/MediaValidator';
import Database from '@ioc:Adonis/Lucid/Database';
import { updateField } from 'App/Helpers/Utilities';

export default class MediaManager extends BaseManager<typeof Media> {
  public ModelClass = Media;

  public validators = {
    translation,
  };

  constructor(ctx: HttpContextContract) {
    super(ctx, Media);
  }

  public query() {
    return super.query().preload('renditions').preload('license');
  }

  public async update() {
    const { attributes, relations } = await this.ctx.request.validate(
      new UpdateMediaValidator(this.ctx)
    );

    const media = await this.byId();
    await Database.transaction(async (trx) => {
      media.useTransaction(trx);

      updateField(attributes, media, 'copyright');
      updateField(attributes, media, 'license');
      updateField(attributes, media, 'expiresAt');

      if (relations?.license) {
        media.mediaLicenseId = relations?.license;
        await media.load('license');
      }

      if (media.$isDirty) {
        await media.save();
      }
    });

    return this.instance;
  }

  public async delete() {
    const { attributes } = await this.ctx.request.validate(
      new DeleteMediaValidator(this.ctx)
    );

    return await this.$deleteObject(Media, attributes?.id);
  }
}
