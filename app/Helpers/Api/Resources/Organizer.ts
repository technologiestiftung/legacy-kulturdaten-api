import OrganizerModel from 'App/Models/Organizer';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';

export default class Organizer extends BaseResource {
  public instance: OrganizerModel;

  public id = 'public_id';

  public attributes = ['name'];

  public relations = ['type', 'subject', 'address'];
}
