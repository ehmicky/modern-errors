// Validate error class name
export const validateClassName = function (className, ErrorClasses) {
  if (!hasUnknownError(className, ErrorClasses)) {
    throw new TypeError(`The first call to "AnyError.class()" must use "UnknownError" as first argument, not "${className}".
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }

  if (ErrorClasses[className] !== undefined) {
    throw new TypeError(`Error class "${className}" has already been defined.`)
  }

  if (className === 'AnyError') {
    throw new TypeError(`Error class name must not be "AnyError".
It is reserved for the base error class.`)
  }
}

// We do not automatically create `UnknownError` to allow configuring it.
const hasUnknownError = function (className, { UnknownError }) {
  return className === 'UnknownError' || UnknownError !== undefined
}
