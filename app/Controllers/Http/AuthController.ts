import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { UserStatus } from 'App/Models/User';
import AuthRegisterValidator from 'App/Validators/AuthRegisterValidator';
import AuthLoginValidator from 'App/Validators/AuthLoginValidator';
import UnauthorizedException from 'App/Exceptions/UnauthorizedException';
import Event from '@ioc:Adonis/Core/Event';

export default class UsersController {
  public async info({ auth }: HttpContextContract) {
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    return auth.user;
  }

  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(AuthRegisterValidator);
    const user = await User.create(data);

    Event.emit('new:user', user);

    return response.ok({
      user,
      status: 200,
      message: 'Account created successfully',
    });
  }

  public async verify({ params, request, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return response.badRequest({
        status: 400,
        message: 'Invalid signature',
      });
    }

    const user: User = await User.findByOrFail('email', params.email);
    if (user.isActive()) {
      return response.conflict({
        status: 409,
        message: 'Address already verified',
      });
    }

    user.status = UserStatus.ACTIVE;
    await user.save();

    return response.ok({
      status: 200,
      message: 'Successfully verified account',
    });
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(AuthLoginValidator);
    const token = await auth.use('api').attempt(data.email, data.password);

    return response.ok({
      token: token.toJSON(),
      status: 200,
      message: 'Logged in successfully',
    });
  }
}
