import { setErrorName } from 'error-class-utils'

import { setInheritedMethods } from './inherited.js'

// The `custom` option can be used to customize a specific error class.
// It must extend from `AnyError`.
// It can be `AnyError` itself (which is the default value).
// We use a thin child class instead of `custom` directly since this allows:
//  - Mutating it, e.g. its `name`, without modifying the `custom` option
//  - Creating several classes with the same `custom` option
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes.
export const getErrorClass = function ({
  AnyError,
  className,
  custom = AnyError,
  plugins,
}) {
  validateCustomClass(custom, AnyError)
  const ErrorClass = class extends custom {}
  setErrorName(ErrorClass, className)
  setInheritedMethods({ ErrorClass, custom, plugins, className, AnyError })
  return ErrorClass
}

const validateCustomClass = function (custom, AnyError) {
  if (typeof custom !== 'function') {
    throw new TypeError(`The "custom" property must be a class: ${custom}`)
  }

  if (!isAnyErrorChild(custom, AnyError)) {
    throw new TypeError('The "custom" class must extend from AnyError.')
  }

  validatePrototype(custom)
}

const isAnyErrorChild = function (ErrorClass, AnyError) {
  return (
    ErrorClass === AnyError ||
    (ErrorClass !== null &&
      isAnyErrorChild(Object.getPrototypeOf(ErrorClass), AnyError))
  )
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
