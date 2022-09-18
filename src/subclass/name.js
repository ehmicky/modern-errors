// Validate error class name
export const validateClassName = function (className, ErrorClasses) {
  requireUnknownError(className, ErrorClasses)

  if (ErrorClasses[className] !== undefined) {
    throw new TypeError(`Error class "${className}" has already been defined.`)
  }

  if (className === 'AnyError') {
    throw new TypeError(`Error class name must not be "AnyError".
It is reserved for the base error class.`)
  }
}

// `UnknownError` is used by `new AnyError()` and `AnyError.normalize()`.
// Therefore, it is required.
// We do not automatically create `UnknownError` to encourage exporting it and
// optionally configuring it.
const requireUnknownError = function (className, { UnknownError }) {
  if (className !== 'UnknownError' && UnknownError === undefined) {
    throw new TypeError(`The first call to "AnyError.class()" must use "UnknownError" as first argument, not "${className}".
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }
}
