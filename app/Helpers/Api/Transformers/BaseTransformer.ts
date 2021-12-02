import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Resource from 'App/Helpers/Api/Resource';
import { get, unset } from 'lodash';

const WILDCARD_INDEX_PATTERN = '.[*].';

interface TransformGuards {
  format?: 'xls' | 'json';
  isSuperadmin?: boolean;
  isOwner?: boolean;
  callback?: () => boolean;
}

export class BaseTransformer {
  public ctx: HttpContextContract;

  public resource: any;

  constructor(ctx: HttpContextContract, resource) {
    this.ctx = ctx;
    this.resource = resource;
  }

  private $passesFormatGuard(guards: TransformGuards) {
    if (!guards.format) {
      return true;
    }

    const format = this.ctx.request.input('format', 'json');
    return guards.format.includes(format);
  }

  private $passesSuperadminGuard(guards: TransformGuards) {
    return true;
  }

  private $passesOwnerGuard(guards: TransformGuards) {
    return true;
  }

  private $passesGuards(guards: TransformGuards) {
    if (!guards) {
      return true;
    }

    return (
      this.$passesFormatGuard(guards) &&
      this.$passesSuperadminGuard(guards) &&
      this.$passesOwnerGuard(guards)
    );
  }

  public stripMany(keys: string[], guards) {
    if (guards && !this.$passesGuards(guards)) {
      return;
    }

    for (const key of keys) {
      this.strip(key);
    }
  }

  public strip(key: string, guards?: TransformGuards | undefined) {
    if (guards && !this.$passesGuards(guards)) {
      return;
    }

    // Check if the key contains a wildcard index. If it does,
    // all keys in an array need to be unset
    if (key.includes(WILDCARD_INDEX_PATTERN)) {
      const arrayPath = key.split(WILDCARD_INDEX_PATTERN)[0];
      const array = get(this.resource, arrayPath);

      // It may be a certain include is not even there, then it doesn't
      // need to be further evaluated
      if (array) {
        for (let index = 0; index < array.length; index++) {
          this.strip(
            key.replace(WILDCARD_INDEX_PATTERN, `.${index.toString()}.`)
          );
        }
      }
    }
    if (!key.includes(WILDCARD_INDEX_PATTERN)) {
      unset(this.resource, key);
    }
  }

  public run() {
    return this.resource;
  }
}
