import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  computed,
  afterCreate,
} from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import Organizer from 'App/Models/Organizer/Organizer';
import Event from '@ioc:Adonis/Core/Event';

export default class OrganizerRole extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public role: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public organizerId: string;

  @belongsTo(() => Organizer, {
    localKey: 'publicId',
  })
  public organizer: BelongsTo<typeof Organizer>;

  @column({ serializeAs: null })
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @computed()
  public get isActive() {
    return !!this.userId;
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @afterCreate()
  public static async sendNotification(role: OrganizerRole) {
    if (!role.isActive) {
      Event.emit('organizerRole:new', role);
    }
  }
}
