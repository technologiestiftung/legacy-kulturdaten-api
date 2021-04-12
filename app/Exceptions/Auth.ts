import { Exception } from '@poppinss/utils';

export class InvalidCredentialsException extends Exception {
  constructor() {
    super(
      'The credentials provided can not be used to login',
      401,
      'E_UNAUTHORIZED'
    );
  }
}

export class UnauthorizedException extends Exception {
  constructor() {
    super(
      'The action you try to perform is only allowed for authenticated users.',
      401,
      'E_UNAUTHORIZED'
    );
  }
}

export class UnverifiedUserException extends Exception {
  constructor() {
    super(
      "The user's email address needs to be verified before they can login",
      428,
      'E_UNAUTHORIZED'
    );
  }
}
