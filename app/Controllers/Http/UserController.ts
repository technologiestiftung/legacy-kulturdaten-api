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
import { ApiDocument } from 'App/Helpers/Api/Document';
import Resource from 'App/Helpers/Api/Resource';
import { UserUpdateValidator } from 'App/Validators/UserValidator';

export default class UserController {
  public async update(ctx: HttpContextContract) {
    const { auth, request, response } = ctx;
    const user = auth.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const { attributes } = await request.validate(UserUpdateValidator);
    user.merge(attributes);
    await user.save();

    const resource = new Resource(user);
    resource.boot();

    return new ApiDocument(ctx, resource);
  }
}
