// Validate a custom error class
export const validateCustomClass = function (custom, AnyError) {
  if (typeof custom !== 'function') {
    throw new TypeError(`The "custom" property must be a class: ${custom}`)
  }

  validateClass(custom, AnyError)
  validatePrototype(custom)
}

const validateClass = function (custom, AnyError) {
  if (custom === AnyError) {
    throw new TypeError('The "custom" class must not be AnyError.')
  }

  if (FORBIDDEN_ERROR_CLASSES.has(custom)) {
    throw new TypeError(`The "custom" class must not be ${custom.name}.`)
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
