import OrganizerModel from 'App/Models/Organizer';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';

export default class Organizer extends BaseResource {
  public instance: OrganizerModel;

  public id = 'publicId';

  public attributes = ['name', 'description'];

  public relations = ['type', 'subjects', 'address'];
}
