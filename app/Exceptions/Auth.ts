import { Exception } from '@poppinss/utils';

export class InvalidCredentialsException extends Exception {
  constructor() {
    super(
      'The credentials provided can not be used to login',
      401,
      'E_INVALID_CREDENTIALS'
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
      'E_UNVERIFIED_USER'
    );
  }
}

export class UserAlreadyVerifiedException extends Exception {
  constructor() {
    super(
      "This user's email address has already been verified",
      409,
      'E_USER_ALREADY_VERIFIED'
    );
  }
}
