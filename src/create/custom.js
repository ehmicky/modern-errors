import { setErrorName } from 'error-class-utils'

import { validateCustomClass } from './validate.js'

// `*Error.custom` can be used to customize a specific error class
export const getErrorClass = function ({
  custom,
  AnyError,
  globalOpts,
  className,
}) {
  const GlobalAnyError = createGlobalAnyError(globalOpts, AnyError)
  const ErrorClass =
    custom === undefined
      ? newErrorClass(GlobalAnyError)
      : getCustomClass({
          custom,
          ParentAnyError: GlobalAnyError,
          AnyError,
          propName: className,
        })
  setErrorName(ErrorClass, className)
  return ErrorClass
}

// `AnyError.custom` can be used to customize all error classes
const createGlobalAnyError = function ({ custom }, AnyError) {
  if (custom === undefined) {
    return AnyError
  }

  const GlobalAnyError = getCustomClass({
    custom,
    ParentAnyError: AnyError,
    AnyError,
    propName: 'AnyError',
  })
  setErrorName(GlobalAnyError, 'GlobalAnyError')
  return GlobalAnyError
}

const newErrorClass = function (GlobalAnyError) {
  return class extends GlobalAnyError {}
}

const getCustomClass = function ({
  custom,
  ParentAnyError,
  AnyError,
  propName,
}) {
  validateCustomClass(custom, AnyError, propName)
  setParentError({ custom, ParentAnyError, AnyError, propName })
  return custom
}

// Changes class's parent from `Error` to `AnyError`.
// We do not allow the custom class to extend from `Error` indirectly since:
//  - Composition can usually be used instead of inheritance
//  - Whether the indirect parent is a known class or not would be ambiguous
//  - This removes any complexity due to two custom classes sharing the same
//    parent
//  - User might not expect parent classes to be mutated
const setParentError = function ({
  custom,
  ParentAnyError,
  AnyError,
  propName,
}) {
  const ParentClass = Object.getPrototypeOf(custom)

  if (isPassedTwice(ParentClass, AnyError)) {
    return
  }

  if (ParentClass !== Error) {
    throw new TypeError(
      `The "${propName}.custom" class must extend from Error.`,
    )
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom, ParentAnyError)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom.prototype, ParentAnyError.prototype)
}

const isPassedTwice = function (ParentClass, AnyError) {
  return (
    ParentClass === AnyError ||
    (ParentClass !== null &&
      isPassedTwice(Object.getPrototypeOf(ParentClass), AnyError))
  )
}
