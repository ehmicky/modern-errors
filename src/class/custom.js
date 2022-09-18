import { setErrorName } from 'error-class-utils'

import { setInheritedMethods } from './inherited.js'

// The `custom` option can be used to customize a specific error class.
// It must extend directly from `AnyError`.
// We use a thin child class instead of `custom` directly since this allows:
//  - Mutating it, e.g. its `name`, without modifying the `custom` option
//  - Creating several classes with the same `custom` option
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes.
// We allow `ErrorClass.class()` to create subclasses.
export const getErrorClass = function ({
  ParentError,
  AnyError,
  className,
  custom,
  plugins,
}) {
  const customA = validateCustomClass(custom, ParentError)
  const ErrorClass = class extends customA {}
  setErrorName(ErrorClass, className)
  setInheritedMethods({
    ErrorClass,
    custom: customA,
    plugins,
    className,
    AnyError,
  })
  return ErrorClass
}

const validateCustomClass = function (custom, ParentError) {
  if (custom === undefined) {
    return ParentError
  }

  if (typeof custom !== 'function') {
    throw new TypeError(`The "custom" property must be a class: ${custom}`)
  }

  validateParent(custom, ParentError)
  validatePrototype(custom)
  return custom
}

// We do not allow passing `ParentError` without extending from it, since
// `undefined` can be used for it instead.
// We do not allow extending from `ParentError` indirectly:
//  - This promotes using subclassing through `ErrorClass.class()`, since it
//    reduces the risk of user instantiating unregistered class
//  - This promotes `ErrorClass.class()` as a pattern for subclassing, to
//    reduce the risk of directly extending a registered class without
//    registering the subclass
const validateParent = function (custom, ParentError) {
  if (custom === ParentError) {
    throw new TypeError(
      `The "custom" class must extend from ${ParentError.name}, but not be ${ParentError.name} itself.`,
    )
  }

  if (Object.getPrototypeOf(custom) !== ParentError) {
    throw new TypeError(
      `The "custom" class must extend directly from ${ParentError.name}.`,
    )
  }
}

const validatePrototype = function (custom) {
  if (typeof custom.prototype !== 'object' || custom.prototype === null) {
    throw new TypeError(
      `The "custom" class's prototype is invalid: ${custom.prototype}`,
    )
  }

  if (custom.prototype.constructor !== custom) {
    throw new TypeError(
      'The "custom" class has an invalid "constructor" property.',
    )
  }
}
