import { Exception } from '@poppinss/utils';

export class InvalidRouteSignature extends Exception {
  constructor() {
    super('The embedded route signature is invalid', 400, 'E_UNAUTHORIZED');
  }
}
