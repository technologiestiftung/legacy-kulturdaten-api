import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Resource from 'App/Helpers/Api/Resource';
import { get, unset, set } from 'lodash';

const WILDCARD_INDEX_PATTERN = '.[*]';

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

  private $resolveWildcardKey(
    key,
    callback: (resolvedKey: string, resolvedIndex: number) => void
  ) {
    if (!key.includes(WILDCARD_INDEX_PATTERN)) {
      return key;
    }

    const arrayKey = key.split(WILDCARD_INDEX_PATTERN)[0];
    const array = get(this.resource, arrayKey);
    if (array) {
      for (let index = 0; index < array.length; index++) {
        const resolvedKey = key.replace(
          WILDCARD_INDEX_PATTERN,
          `.${index.toString()}`
        );
        callback(resolvedKey, index);
      }
    }
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

    const resolvedKey = this.$resolveWildcardKey(key, (resolvedKey) => {
      this.strip(resolvedKey);
    });

    if (resolvedKey) {
      unset(this.resource, key);
    }
  }

  public transformMany(
    keys: string[],
    callback: (value: any) => any,
    guards?: TransformGuards | undefined
  ) {
    if (guards && !this.$passesGuards(guards)) {
      return;
    }

    for (const key of keys) {
      this.transform(key, callback);
    }
  }

  public transform(
    key,
    callback: (value: any) => any,
    guards?: TransformGuards | undefined
  ) {
    if (guards && !this.$passesGuards(guards)) {
      return;
    }

    const resolvedKey = this.$resolveWildcardKey(
      key,
      (resolvedKey, resolvedIndex) => {
        this.transform(resolvedKey, callback);
      }
    );

    if (resolvedKey) {
      const currentValue = get(this.resource, resolvedKey);
      if (!currentValue) {
        return;
      }

      const newValue = callback(currentValue);
      set(this.resource, resolvedKey, newValue);
    }
  }

  public run() {
    return this.resource;
  }
}
