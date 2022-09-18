import { setErrorName } from 'error-class-utils'

import { validateCustomClass } from './validate.js'

// `*Error.custom` can be used to customize a specific error class
export const getErrorClass = function (custom, AnyError, className) {
  const ErrorClass =
    custom === undefined
      ? newErrorClass(AnyError)
      : getCustomClass(custom, AnyError)
  setErrorName(ErrorClass, className)
  return ErrorClass
}

const newErrorClass = function (AnyError) {
  return class extends AnyError {}
}

const getCustomClass = function (custom, AnyError) {
  validateCustomClass(custom, AnyError)
  setParentError(custom, AnyError)
  return custom
}

// Changes class's parent from `Error` to `AnyError`.
const setParentError = function (custom, AnyError) {
  const ParentClass = Object.getPrototypeOf(custom)

  if (!hasAncestor(ParentClass, Error)) {
    throw new TypeError('The "custom" class must extend from Error.')
  }

  if (hasAncestor(ParentClass, AnyError)) {
    return
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom, AnyError)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom.prototype, AnyError.prototype)
}

const hasAncestor = function (ParentClass, ErrorClass) {
  return (
    ParentClass === ErrorClass ||
    (ParentClass !== null &&
      hasAncestor(Object.getPrototypeOf(ParentClass), ErrorClass))
  )
}
