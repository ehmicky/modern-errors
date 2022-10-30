import type { ErrorName } from 'error-custom-class'

/**
 * Forbid 'AnyError' to be passed as first argument to `ErrorClass.subclass()`
 */
export type IsForbiddenClassName<ErrorNameArg extends ErrorName> =
  ErrorNameArg extends 'AnyError' ? true : false
