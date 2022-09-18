// Validate a custom error class
export const validateCustomClass = function (custom, AnyError, propName) {
  if (typeof custom !== 'function') {
    throw new TypeError(
      `The first argument's "${propName}.custom" property must be a class: ${custom}`,
    )
  }

  validateClass(custom, AnyError, propName)
  validateParent(custom, AnyError, propName)
  validatePrototype(custom, propName)
}

const validateClass = function (custom, AnyError, propName) {
  if (custom === AnyError) {
    throw new TypeError(`The "${propName}.custom" class must not be AnyError.`)
  }

  if (FORBIDDEN_ERROR_CLASSES.has(custom)) {
    throw new TypeError(
      `The "${propName}.custom" class must not be ${custom.name}.`,
    )
  }
}

const FORBIDDEN_ERROR_CLASSES = new Set([
  ReferenceError,
  TypeError,
  SyntaxError,
  RangeError,
  URIError,
  EvalError,
])

// We do not allow the custom class to extend from `Error` indirectly since:
//  - Composition can usually be used instead of inheritance
//  - Whether the indirect parent is a known class or not would be ambiguous
//  - This removes any complexity due to two custom classes sharing the same
//    parent
//  - User might not expect parent classes to be mutated
const validateParent = function (custom, AnyError, propName) {
  const ParentClass = Object.getPrototypeOf(custom)

  if (isPassedTwice(ParentClass, AnyError)) {
    throw new TypeError(
      `The "${propName}.custom" class must not be passed to modernErrors() twice.`,
    )
  }

  if (ParentClass !== Error) {
    throw new TypeError(
      `The "${propName}.custom" class must extend from Error.`,
    )
  }
}

const isPassedTwice = function (ParentClass, AnyError) {
  return (
    ParentClass === AnyError ||
    (ParentClass !== null &&
      isPassedTwice(Object.getPrototypeOf(ParentClass), AnyError))
  )
}

const validatePrototype = function (custom, propName) {
  if (typeof custom.prototype !== 'object' || custom.prototype === null) {
    throw new TypeError(
      `The "${propName}.custom" class's prototype is invalid: ${custom.prototype}`,
    )
  }

  if (custom.prototype.constructor !== custom) {
    throw new TypeError(
      `The "${propName}.custom" class has an invalid "constructor" property.`,
    )
  }
}
