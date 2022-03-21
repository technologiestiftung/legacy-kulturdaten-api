import User from 'App/Models/User';
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';
import Location from 'App/Models/Location/Location';
import Database from '@ioc:Adonis/Lucid/Database';

export default class LocationPolicy extends BasePolicy {
  public async edit(user: User, locationId: string) {
    if (user.isSuperuser) {
      return true;
    }

    const locations = await Location.query()
      .where('public_id', locationId)
      .andWhereIn(
        'organizer_id',
        Database.from('organizer_roles')
          .where('user_id', user.id)
          .select('organizer_id')
      );

    return locations.length > 0;
  }
}
