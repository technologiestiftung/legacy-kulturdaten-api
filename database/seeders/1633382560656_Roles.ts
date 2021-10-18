import { LucidModel } from '@ioc:Adonis/Lucid/Model';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';
import Organizer from 'App/Models/Organizer/Organizer';
import Location from 'App/Models/Location/Location';
import Offer from 'App/Models/Offer/Offer';
import faker from 'faker';
import { OrganizerRole, LocationRole, OfferRole } from 'App/Models/Roles';
import { Roles } from 'App/Helpers/Roles';

export default class RoleSeeder extends BaseSeeder {
  private $selectObject(objects) {
    return faker.random.arrayElement(objects);
  }

  private $selectObjects(objects, count = 3) {
    return faker.random.arrayElements(
      objects,
      faker.datatype.number(count) || 1
    );
  }

  public async run() {
    const users = await User.all();

    const organizers = await Organizer.all();
    const locations = await Location.all();
    const offers = await Offer.all();

    for (const user of users) {
      for (const organizer of this.$selectObjects(organizers) as Organizer[]) {
        const organizerRole = new OrganizerRole();
        organizerRole.fill({
          userId: user.id,
          organizerId: organizer.publicId,
          role: Roles.OWNER,
        });

        await organizerRole.save();
      }

      const location = this.$selectObject(locations) as Location;
      const locationRole = new LocationRole();
      locationRole.fill({
        userId: user.id,
        locationId: location.id,
        role: Roles.EDITOR,
      });
      await locationRole.save();

      const offer = this.$selectObject(offers) as Offer;
      const offerRole = new OfferRole();
      offerRole.fill({
        userId: user.id,
        offerId: offer.id,
        role: Roles.EDITOR,
      });
      await offerRole.save();
    }
  }
}
