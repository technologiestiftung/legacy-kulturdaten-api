import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import Tag from 'App/Models/Tag';

export default class TagManager extends BaseManager<typeof Tag> {
  public ModelClass = Tag;

  constructor(ctx: HttpContextContract) {
    super(ctx, Tag);
  }
}
