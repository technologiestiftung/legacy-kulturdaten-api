import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  computed,
} from '@ioc:Adonis/Lucid/Orm';
import { OrganizerRole, LocationRole, OfferRole } from 'App/Models/Roles';
import { termsUpdatedAt } from 'Config/app';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export default class User extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public status: string;

  @column()
  public rememberMeToken?: string;

  @column()
  public isSuperuser: boolean;

  @hasMany(() => OrganizerRole)
  public organizers: HasMany<typeof OrganizerRole>;

  @hasMany(() => LocationRole)
  public locations: HasMany<typeof LocationRole>;

  @hasMany(() => OfferRole)
  public offers: HasMany<typeof OfferRole>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public acceptedTermsAt: DateTime;

  @computed()
  public get hasAcceptedCurrentTerms() {
    return termsUpdatedAt <= this.acceptedTermsAt;
  }

  @column.dateTime()
  public deletionRequestedAt: DateTime | null;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  public isActive() {
    return this.status === UserStatus.ACTIVE;
  }
}
