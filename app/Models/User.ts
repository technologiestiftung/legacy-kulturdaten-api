import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  column,
  beforeSave,
  BaseModel,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Organizer from './Organizer';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public status: string;

  @column()
  public rememberMeToken?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @manyToMany(() => User, {
    relatedKey: 'id',
    localKey: 'public_id',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'organizer_public_id',
  })
  public organizers: ManyToMany<typeof Organizer>;

  public isActive() {
    return this.status === UserStatus.ACTIVE;
  }
}
