import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BaseManager from 'App/Helpers/Managers/BaseManager';
import OrganizerSubject from 'App/Models/OrganizerSubject';

export default class OrganizerSubjectManager extends BaseManager<
  typeof OrganizerSubject
> {
  public ModelClass = OrganizerSubject;

  constructor(ctx: HttpContextContract) {
    super(ctx, OrganizerSubject);
  }

  public query() {
    return super
      .query()
      .where('organizer_type_id', this.ctx.params.organizer_type_id)
      .preload('type');
  }
}
