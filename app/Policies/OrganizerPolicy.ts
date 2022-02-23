import User from 'App/Models/User';
import Organizer from 'App/Models/Organizer';
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';
import { OrganizerRole } from 'App/Models/Roles';

export default class OrganizerPolicy extends BasePolicy {
  public async edit(user: User, organizerId: string) {
    if (user.isSuperuser) {
      return true;
    }

    const roles = await OrganizerRole.query()
      .where('user_id', user.id)
      .andWhere('organizer_id', organizerId);
    return roles.length;
  }
}
