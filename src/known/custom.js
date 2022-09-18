import { setErrorName } from 'error-class-utils'

import { validateCustomClass } from './validate.js'

// `AnyError.custom` can be used to customize all error classes
export const createGlobalAnyError = function ({ custom }, AnyError) {
  if (custom === undefined) {
    return AnyError
  }

  const GlobalAnyError = getCustomClass(custom, AnyError, 'AnyError')
  setErrorName(GlobalAnyError, 'GlobalAnyError')
  return GlobalAnyError
}

// `*Error.custom` can be used to customize a specific error class
export const getErrorClass = function (custom, GlobalAnyError, className) {
  const ErrorClass =
    custom === undefined
      ? newErrorClass(GlobalAnyError)
      : getCustomClass(custom, GlobalAnyError, className)
  setErrorName(ErrorClass, className)
  return ErrorClass
}

const newErrorClass = function (GlobalAnyError) {
  return class extends GlobalAnyError {}
}

const getCustomClass = function (custom, ParentAnyError, propName) {
  validateCustomClass(custom, propName)
  setParentError(custom, ParentAnyError)
  return custom
}

// Changes class's parent from `Error` to `AnyError`.
const setParentError = function (custom, ParentAnyError) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom, ParentAnyError)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom.prototype, ParentAnyError.prototype)
}
