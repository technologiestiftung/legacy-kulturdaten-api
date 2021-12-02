import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import {
  CreateUserValidator,
  UpdateUserValidator,
} from 'App/Validators/Admin/UserValidator';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Resource from 'App/Helpers/Api/Resource';

export default class UserController {
  public async index(ctx: HttpContextContract) {
    const { bouncer } = ctx;
    await bouncer.authorize('superuser');

    const users = await User.all();

    return new ApiDocument(
      ctx,
      users.map((user) => {
        const resource = new Resource(user);
        resource.boot();

        return resource;
      })
    );
  }

  public async store(ctx: HttpContextContract) {
    const { bouncer, request } = ctx;
    await bouncer.authorize('superuser');

    const { attributes } = await request.validate(CreateUserValidator);
    const user = await User.create(attributes);

    const resource = new Resource(user);
    resource.boot();

    return new ApiDocument(ctx, resource);
  }

  public async update(ctx: HttpContextContract) {
    const { bouncer, params, request } = ctx;
    await bouncer.authorize('superuser');

    const user = await User.findOrFail(params.id);
    const { attributes } = await request.validate(UpdateUserValidator);
    user.merge(attributes);
    await user.save();

    const resource = new Resource(user);
    resource.boot();

    return new ApiDocument(ctx, resource);
  }
}
