import OrganizerTypeModel from 'App/Models/OrganizerType';
import BaseResource from 'App/Helpers/Api/Resources/BaseResource';

export default class OrganizerType extends BaseResource {
  public instance: OrganizerTypeModel;

  public relations = ['subjects'];
}
