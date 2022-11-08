import faker from '@faker-js/faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Organizer from 'App/Models/Organizer/Organizer';
import { OrganizerRole } from 'App/Models/Roles';
import User, { UserStatus } from 'App/Models/User';

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true;

  public async run() {
    // Additionally to running this seeder in development
    // only, also make sure there are now Users yet
    const users = await User.all();
    if (users.length) {
      return;
    }

    const admin = await User.create({
      email: 'admin@kulturdaten.berlin',
      password: 'admin',
      status: UserStatus.ACTIVE,
      isSuperuser: true,
    });

    const organizers = await Organizer.all();
    if (organizers.length) {
      const organizer = faker.random.arrayElement(organizers);
      await OrganizerRole.create({
        email: admin.email,
        userId: admin.id,
        organizerId: organizer.publicId,
      });
    }
  }
}
