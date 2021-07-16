import Offer from 'App/Models/Offer';
import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';

export default class OfferUpdateListener {
  public async createRecurringDates(offer: Offer) {
    // Clean already existing non-manual dates for this offer
    await offer.load('dates', (query) => {
      return query.where('is_manual', 0);
    });

    await Database.modelQuery(Offer)
      .delete()
      .whereIn(
        'id',
        offer.dates.map((date) => {
          return date.id;
        })
      );

    // Create new dates from recurrance rule if there is one
    if (!offer.rrule) {
      return;
    }

    const dates = offer.rrule.after(DateTime.now().toJSDate());
    // // const dates = offer.rrule.all();
    // console.log({
    //   today: DateTime.now().toJSDate(),
    //   rrule: offer.rrule,
    //   dates,
    // });
  }
}
