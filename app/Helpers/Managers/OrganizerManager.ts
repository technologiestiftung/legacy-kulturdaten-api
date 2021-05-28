import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Organizer from 'App/Models/Organizer';
import OrganizerResource from 'App/Helpers/Api/Resources/Organizer';

export class OrganizerManager {
  public instances: Array<Organizer>;

  public language: string;

  public static async all(ctx: HttpContextContract) {
    const { language } = ctx;

    const instances = await OrganizerManager.query();

    return new OrganizerManager(instances, language);
  }

  public static async fromContext(ctx: HttpContextContract) {
    const { params, language } = ctx;
    return await OrganizerManager.byId(params.id, language as string);
  }

  public static query() {
    return Organizer.query()
      .preload('translations')
      .preload('address')
      .preload('type', (query) => {
        query.preload('translations');
      })
      .preload('subjects', (query) => {
        query.preload('translations');
      });
  }

  public static async byId(id: string, language: string) {
    const instance = await OrganizerManager.query()
      .where('public_id', id)
      .firstOrFail();

    return new OrganizerManager([instance], language);
  }

  constructor(instances, language) {
    this.instances = instances;
    this.language = language;
  }

  public toResources(): Array<OrganizerResource> {
    return this.instances.map((instance) => {
      const resource: OrganizerResource = new OrganizerResource(
        instance,
        this.language
      );
      resource.boot();
      return resource;
    });
  }
}

export default OrganizerManager;
