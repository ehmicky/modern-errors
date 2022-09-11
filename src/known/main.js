import { setErrorName } from 'error-class-utils'
import isPlainObj from 'is-plain-obj'

import { setClassOpts } from '../plugins/class_opts.js'

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

// Validate, normalize and create each error class.
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes
export const initKnownClasses = function ({
  classesOpts,
  globalOpts,
  GlobalBaseError,
  errorData,
  plugins,
}) {
  return Object.fromEntries(
    Object.entries(classesOpts).map(([className, classOpts]) => [
      className,
      initKnownClass({
        className,
        classOpts,
        GlobalBaseError,
        errorData,
        plugins,
        globalOpts,
      }),
    ]),
  )
}

const initKnownClass = function ({
  className,
  classOpts,
  GlobalBaseError,
  errorData,
  plugins,
  globalOpts,
}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The first argument's "${className}" property must be a plain object: ${classOpts}`,
    )
  }

  const { custom, ...classOptsA } = classOpts
  const ErrorClass = getErrorClass(custom, GlobalBaseError, className)
  setErrorName(ErrorClass, className)
  setClassOpts({
    ErrorClass,
    globalOpts,
    classOpts: classOptsA,
    errorData,
    plugins,
  })
  return ErrorClass
}

const getErrorClass = function (custom, GlobalBaseError, className) {
  return custom === undefined
    ? newErrorClass(GlobalBaseError)
    : getCustomClass(custom, GlobalBaseError, className)
}

const newErrorClass = function (GlobalBaseError) {
  return class extends GlobalBaseError {}
}

const getCustomClass = function (custom, ParentBaseError, className) {
  validateCustomClass(custom, className)
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
