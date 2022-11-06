import type { ErrorName } from 'error-custom-class'

/**
 * Forbid 'BaseError' to be passed as first argument to `ErrorClass.subclass()`
 */
export type IsForbiddenClassName<ErrorNameArg extends ErrorName> =
  ErrorNameArg extends 'BaseError' ? true : false
