// UnknownError cannot have a `custom` class:
//  - This ensures its constructor does not throw
//  - This discourages instantiating UnknownError directly, encouraging creating
//    a separate error class for known system errors instead
// We discourage extending or instantiating UnknownError but do not forbid it
// since:
//  - Users might not know instantiating would throw until runtime, which is
//    problematic in error handling logic
//  - There could be some potential use cases, e.g. if a branch is never meant
//    to happen unless some unknown bug happened
export const validateCustomUnknown = function (custom, className) {
  if (custom !== undefined && className === 'UnknownError') {
    throw new TypeError(
      'Error option "custom" is not available with "UnknownError".',
    )
  }
}

// `UnknownError` is used by `new AnyError()` and `AnyError.normalize()`.
// Therefore, it is required.
// We do not automatically create `UnknownError` to encourage exporting it and
// optionally configuring it.
export const requireUnknownError = function (ErrorClasses) {
  if (Object.keys(ErrorClasses).length === 0) {
    throw new Error(`At least one error class must be created.
This is done by calling "AnyError.subclass()".`)
  }

  if (ErrorClasses.UnknownError === undefined) {
    throw new Error(`One of the error classes must be named "UnknownError".
This is done by calling "AnyError.subclass('UnknownError')".
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }
}
