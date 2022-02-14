import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
import {
  LoginValidator,
  CreateUserValidator,
  RequestPasswordResetValidator,
  PasswordResetValidator,
} from 'App/Validators/AuthValidator';
import Event from '@ioc:Adonis/Core/Event';
import {
  UnauthorizedException,
  UnverifiedUserException,
} from 'App/Exceptions/Auth';
import { InvalidRouteSignature } from 'App/Exceptions/InvalidRouteSignature';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Resource from 'App/Helpers/Api/Resource';
import Env from '@ioc:Adonis/Core/Env';

export default class AuthController {
  public async info(ctx: HttpContextContract) {
    const { auth, response } = ctx;
    const user = auth.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    await Promise.all([
      user.load('organizers', (query) => {
        query.preload('organizer', (query) => {
          query.preload('translations');
          query.preload('logo');
        });
      }),
      user.load('locations', (query) => {
        query.preload('location');
      }),
      user.load('offers', (query) => {
        query.preload('offer');
      }),
    ]);

    const resource = new Resource(user);
    resource.boot();

    return new ApiDocument(ctx, resource);
  }

  public async validate(ctx: HttpContextContract) {
    const { auth } = ctx;
    return new ApiDocument(ctx, undefined, {
      valid: !!auth.user,
    });
  }

  public async register(ctx: HttpContextContract) {
    const { request, response } = ctx;
    const data = await request.validate(CreateUserValidator);
    const user = await User.create(data);

    Event.emit('user:new', user);
    return new ApiDocument(ctx, user, {
      message: 'Account created successfully',
    });
  }

  public async verify(ctx: HttpContextContract) {
    const { params, request, response } = ctx;

    if (!request.hasValidSignature()) {
      throw new InvalidRouteSignature();
    }

    const user: User = await User.findByOrFail('email', params.email);
    if (!user.isActive()) {
      user.status = UserStatus.ACTIVE;
      await user.save();
    }

    const loginUrl = `${Env.get('APP_URL') as string}/auth/success`;
    return response.redirect().toPath(loginUrl);
  }

  public async login(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    const data = await request.validate(LoginValidator);

    const token = await auth.use('api').attempt(data.email, data.password);

    return new ApiDocument(ctx, undefined, {
      token: token.toJSON(),
      message: 'Logged in successfully',
    });
  }

  public async logout(ctx: HttpContextContract) {
    const { auth } = ctx;
    await auth.logout();
    return new ApiDocument(ctx, undefined, {
      message: 'Logged out successfully',
    });
  }

  public async requestPasswordReset(ctx: HttpContextContract) {
    const { request, response } = ctx;
    const data = await request.validate(RequestPasswordResetValidator);

    const user: User = await User.findByOrFail('email', data.email);
    user.status = UserStatus.INACTIVE;
    user.save();

    Event.emit('auth:requestPasswordReset', data.email);
    return new ApiDocument(ctx, null, {
      message: 'Sent password reset instructions',
    });
  }

  public async resetPassword(ctx: HttpContextContract) {
    const { params, request, response } = ctx;

    const data = await request.validate(PasswordResetValidator);
    const user: User = await User.findByOrFail('email', params.email);

    if (!request.hasValidSignature() || user.status !== UserStatus.INACTIVE) {
      throw new InvalidRouteSignature();
    }

    user.password = data.password;
    user.status = UserStatus.ACTIVE;
    await user.save();

    Event.emit('auth:passwordReset', data.email);
    return new ApiDocument(ctx, user, {
      message: 'Successfully reset password',
    });
  }
}
