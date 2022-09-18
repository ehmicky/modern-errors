import { setErrorName } from 'error-class-utils'

// The `custom` option can be used to customize a specific error class.
// It must extend from `AnyError`.
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes.
export const getErrorClass = function (AnyError, className, custom = AnyError) {
  validateCustomClass(custom, AnyError)
  const ErrorClass = class extends custom {}
  setErrorName(ErrorClass, className)
  return ErrorClass
}

// Validate a custom error class
const validateCustomClass = function (custom, AnyError) {
  if (typeof custom !== 'function') {
    throw new TypeError(`The "custom" property must be a class: ${custom}`)
  }

  if (!extendsFromAnyError(custom, AnyError)) {
    throw new TypeError('The "custom" class must extend from AnyError.')
  }

  validatePrototype(custom)
}

const extendsFromAnyError = function (ErrorClass, AnyError) {
  return (
    ErrorClass === AnyError ||
    (ErrorClass !== null &&
      extendsFromAnyError(Object.getPrototypeOf(ErrorClass), AnyError))
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
      `The "custom" class has an invalid "constructor" property.`,
    )
  }
}
