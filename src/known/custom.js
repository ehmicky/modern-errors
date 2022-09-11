import { setErrorName } from 'error-class-utils'

import { validateCustomClass } from './validate.js'

// `AnyError.custom` can be used to customize all error classes
export const createGlobalBaseError = function ({ custom }, BaseError) {
  if (custom === undefined) {
    return BaseError
  }

  const GlobalBaseError = getCustomClass(custom, BaseError, 'AnyError')
  setErrorName(GlobalBaseError, 'GlobalBaseError')
  return GlobalBaseError
}

// `*Error.custom` can be used to customize a specific error class
export const getErrorClass = function (custom, GlobalBaseError, className) {
  const ErrorClass =
    custom === undefined
      ? newErrorClass(GlobalBaseError)
      : getCustomClass(custom, GlobalBaseError, className)
  setErrorName(ErrorClass, className)
  return ErrorClass
}

const newErrorClass = function (GlobalBaseError) {
  return class extends GlobalBaseError {}
}

const getCustomClass = function (custom, ParentBaseError, propName) {
  validateCustomClass(custom, propName)
  setBaseError(custom, ParentBaseError)
  return custom
}

// Changes class's parent from `Error` to `BaseError`.
// We do this instead of exporting `BaseError` and making users extend from it
// directly because it:
//  - Avoids confusion between `BaseError` and `AnyError`
//  - Removes some exports, simplifying the API
//  - Enforces calling the main function
const setBaseError = function (custom, ParentBaseError) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom, ParentBaseError)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom.prototype, ParentBaseError.prototype)
}
