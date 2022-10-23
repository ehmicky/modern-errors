import type { ErrorName } from 'error-custom-class'

export type IsForbiddenClassName<ErrorNameArg extends ErrorName> =
  ErrorNameArg extends 'AnyError' ? true : false
