import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { UnauthorizedException } from 'App/Exceptions/Auth';
import { ApiDocument } from 'App/Helpers/Api/Document';
import Resource from 'App/Helpers/Api/Resource';
import { UserUpdateValidator } from 'App/Validators/UserValidator';
import { termsUpdatedAt } from 'Config/app';

export default class UserController {
  public async update(ctx: HttpContextContract) {
    const { auth, request, response } = ctx;
    const user = auth.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const { attributes, meta } = await request.validate(UserUpdateValidator);

    user.merge({
      email: attributes.email || user.email,
      acceptedTermsAt: attributes.acceptedTermsAt || user.acceptedTermsAt,
      deletionRequestedAt:
        attributes.deletionRequestedAt || user.deletionRequestedAt,
    });

    if (attributes.password) {
      const authenticated = await auth
        .use('api')
        .verifyCredentials(user.email, attributes.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }

      user.password = attributes.newPassword;
    }

    if (meta?.abortDeletionRequest) {
      user.deletionRequestedAt = null;
    }

    await user.save();

    const resource = new Resource(user);
    resource.boot();

    return new ApiDocument(ctx, resource, {
      termsUpdatedAt,
    });
  }
}
