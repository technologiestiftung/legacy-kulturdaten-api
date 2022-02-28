import User from 'App/Models/User';
import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';
import Database from '@ioc:Adonis/Lucid/Database';

export default class OfferPolicy extends BasePolicy {
  public async edit(user: User, offerId: string) {
    if (user.isSuperuser) {
      return true;
    }

    const offers = await Database.from('offer_organizer')
      .select('*')
      .where(
        'offer_id',
        Database.from('offers').where('public_id', offerId).select('id')
      )
      .andWhereIn(
        'organizer_id',
        Database.from('organizer_roles')
          .select('organizer_id')
          .where('user_id', user.id)
      );

    return offers.length > 0;
  }
}
