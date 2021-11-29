import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { ApiDocument } from 'App/Helpers/Api/Document';
import {
  CreateAppTokenValidator,
  DeleteAppTokenValidator,
} from 'App/Validators/AppTokenValidator';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import Database from '@ioc:Adonis/Lucid/Database';

export default class AppTokenController {
  public async index(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const tokens = await Database.from('app_tokens')
      .where('user_id', auth.user.id)
      .select('id', 'name', 'description');

    return new ApiDocument(ctx, undefined, {
      tokens: tokens.map((token) => {
        return {
          id: token.id,
          name: token.name,
          description: token.description,
        };
      }),
    });
  }

  public async store(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const { attributes } = await request.validate(CreateAppTokenValidator);
    const token = await auth.use('app').generate(auth.user, {
      name: attributes.name,
    });

    return new ApiDocument(ctx, undefined, {
      token: token.toJSON(),
      message: 'Created new token.',
    });
  }

  public async destroy(ctx: HttpContextContract) {
    const { request, auth } = ctx;
    if (!auth.user) {
      throw new UnauthorizedException();
    }

    const { attributes } = await request.validate(DeleteAppTokenValidator);

    await Database.from('app_tokens')
      .where('user_id', auth.user.id)
      .andWhere('name', attributes.name)
      .delete();

    return new ApiDocument(ctx, undefined, {
      message: 'Deleted token successfully.',
    });
  }
}
