import { CoreError } from '../base/main.js'

// Validate a custom error class
export const validateCustomClass = function (custom, className) {
  if (typeof custom !== 'function') {
    throw new TypeError(
      `The first argument's "${className}.custom" property must be a class: ${custom}`,
    )
  }

  validateParent(custom, className)
  validatePrototype(custom, className)
}

// We do not allow the custom class to extend from `Error` indirectly since:
//  - Composition can usually be used instead of inheritance
//  - Whether the indirect parent is a known class or not would be ambiguous
//  - This removes any complexity due to two custom classes sharing the same
//    parent
//  - User might not expect parent classes to be mutated
const validateParent = function (custom, className) {
  if (FORBIDDEN_ERROR_CLASSES.has(custom)) {
    throw new TypeError(
      `The "${className}.custom" class must not be ${custom.name}.`,
    )
  }

  const ParentClass = Object.getPrototypeOf(custom)

  if (isPassedTwice(ParentClass)) {
    throw new TypeError(
      `The "${className}.custom" class must not be passed to modernErrors() twice.`,
    )
  }

  if (ParentClass !== Error) {
    throw new TypeError(
      `The "${className}.custom" class must extend from Error.`,
    )
  }
}

const FORBIDDEN_ERROR_CLASSES = new Set([
  CoreError,
  ReferenceError,
  TypeError,
  SyntaxError,
  RangeError,
  URIError,
  EvalError,
])

const isPassedTwice = function (ParentClass) {
  return (
    ParentClass === CoreError ||
    (ParentClass !== null && isPassedTwice(Object.getPrototypeOf(ParentClass)))
  )
}

const validatePrototype = function (custom, className) {
  if (typeof custom.prototype !== 'object' || custom.prototype === null) {
    throw new TypeError(
      `The "${className}.custom" class's prototype is invalid: ${custom.prototype}`,
    )
  }

  if (custom.prototype.constructor !== custom) {
    throw new TypeError(
      `The "${className}.custom" class has an invalid "constructor" property.`,
    )
  }
}
