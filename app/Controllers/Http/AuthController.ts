import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
import AuthRegisterValidator from 'App/Validators/AuthRegisterValidator';
import AuthLoginValidator from 'App/Validators/AuthLoginValidator';
import Event from '@ioc:Adonis/Core/Event';
import {
  InvalidCredentialsException,
  UnauthorizedException,
  UnverifiedUserException,
  UserAlreadyVerifiedException,
} from 'App/Exceptions/Auth';
import { InvalidRouteSignature } from 'App/Exceptions/InvalidRouteSignature';
import { ApiDocument } from 'App/Helpers/Api';

export default class UsersController {
  public async info({ auth, response }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    return new ApiDocument(response, {
      data: auth.user,
    });
  }

  public async validate({ auth, response }: HttpContextContract) {
    return new ApiDocument(response, {
      meta: { valid: !!auth.user },
    });
  }

  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(AuthRegisterValidator);
    const user = await User.create(data);

    Event.emit('new:user', user);
    return new ApiDocument(
      response,
      {
        data: user,
      },
      'Account created successfully'
    );
  }

  public async verify({ params, request, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      throw new InvalidRouteSignature();
    }

    const user: User = await User.findByOrFail('email', params.email);
    if (user.isActive()) {
      throw new UserAlreadyVerifiedException();
    }

    user.status = UserStatus.ACTIVE;
    await user.save();

    return new ApiDocument(response, {}, 'Successfully verified account');
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(AuthLoginValidator);

    const user = await User.findBy('email', data.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive()) {
      throw new UnverifiedUserException();
    }

    const token = await auth.use('api').attempt(data.email, data.password);

    return new ApiDocument(
      response,
      { meta: token.toJSON() },
      'Logged in successfully'
    );
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout();
    return new ApiDocument(response, {}, 'Logged out successfully');
  }
}
