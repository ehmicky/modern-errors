import { setErrorName } from 'error-class-utils'
import isPlainObj from 'is-plain-obj'

import { setClassOpts } from '../plugins/class_opts.js'

import { validateCustomClass } from './validate.js'

// Validate, normalize and create each error class.
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes
export const initKnownClasses = function ({
  classesOpts,
  globalOpts,
  BaseError,
  errorData,
  plugins,
}) {
  return Object.fromEntries(
    Object.entries(classesOpts).map(([className, classOpts]) => [
      className,
      initKnownClass({
        className,
        classOpts,
        BaseError,
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
  BaseError,
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
  const ErrorClass = getErrorClass(custom, BaseError, className)
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

const getErrorClass = function (custom, BaseError, className) {
  return custom === undefined
    ? newErrorClass(BaseError)
    : getCustomClass(custom, BaseError, className)
}

const newErrorClass = function (BaseError) {
  return class extends BaseError {}
}

const getCustomClass = function (custom, BaseError, className) {
  validateCustomClass(custom, className)
  setBaseError(custom, BaseError)
  return custom
}

// Changes class's parent from `Error` to `BaseError`.
// We do this instead of exporting `BaseError` and making users extend from it
// directly because it:
//  - Avoids confusion between `BaseError` and `AnyError`
//  - Removes some exports, simplifying the API
//  - Enforces calling the main function
const setBaseError = function (custom, BaseError) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom, BaseError)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(custom.prototype, BaseError.prototype)
}
