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

    const document = new ApiDocument(
      ctx,
      users.map((user) => {
        const resource = new Resource(user);
        resource.boot();

        return resource;
      })
    );
    await document.send();
  }

  public async store(ctx: HttpContextContract) {
    const { bouncer, request } = ctx;
    await bouncer.authorize('superuser');

    const { attributes } = await request.validate(CreateUserValidator);
    const user = await User.create(attributes);

    const resource = new Resource(user);
    resource.boot();

    const document = new ApiDocument(ctx, resource);
    await document.send();
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

    const document = new ApiDocument(ctx, resource);
    await document.send();
  }

  public async delete(ctx: HttpContextContract) {
    const { bouncer, params } = ctx;
    await bouncer.authorize('superuser');

    const user = await User.findOrFail(params.id);
    const document = new ApiDocument(ctx, await user.delete());
    await document.send();
  }

  public async show(ctx: HttpContextContract) {
    const { bouncer, params } = ctx;
    await bouncer.authorize('superuser');

    const user = await User.findOrFail(params.id);

    const resource = new Resource(user);
    resource.boot();

    const document = new ApiDocument(ctx, resource);
    await document.send();
  }
}
