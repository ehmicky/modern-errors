// Validate known class name
export const validateClassName = function (className, KnownClasses) {
  if (!hasUnknownError(className, KnownClasses)) {
    throw new TypeError(`The first call to AnyError.create() must use "UnknownError" as first argument.
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }

  if (KnownClasses[className] !== undefined) {
    throw new TypeError(`Error class "${className}" has already been defined.`)
  }

  if (className === 'AnyError') {
    throw new TypeError(`Error class name must not be "AnyError".
It is reserved for the base error class.`)
  }
}

// We enforce specifying `UnknownError` so that users:
//  - Export it
//  - Know they can configure it
const hasUnknownError = function (className, KnownClasses) {
  return KnownClasses.UnknownError !== undefined || className === 'UnknownError'
}
