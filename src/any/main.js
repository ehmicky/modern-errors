import { setErrorName } from 'error-class-utils'

export const createAnyError = function (BaseError) {
  class AnyError extends BaseError {
    static [Symbol.hasInstance] = hasKnownClass.bind(undefined, BaseError)
  }
  setErrorName(AnyError, 'AnyError')
  return AnyError
}

const hasKnownClass = function (BaseError, value) {
  return value instanceof BaseError
}
