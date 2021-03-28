import { Exception } from '@poppinss/utils';

export default class UnauthorizedException extends Exception {
  constructor() {
    super(
      'The action you try to perform is only allowed for authenticated users.',
      401,
      'E_UNAUTHORIZED'
    );
  }
}
