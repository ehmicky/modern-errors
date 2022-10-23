// Array of `errors` can be set using an option.
// This is like `AggregateError` except:
//  - This is available in any class, removing the need to create separate
//    classes for it
//  - Any class can opt-in to it or not
//  - This uses a named parameter instead of a positional one:
//     - This is more monomorphic
//     - This parallels the `cause` option
// Child `errors` are always kept, only appended to.
export const setAggregateErrors = function (error, { errors }) {
  if (errors === undefined) {
    return
  }

  if (!Array.isArray(errors)) {
    throw new TypeError(`"errors" option must be an array: ${errors}`)
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'errors', {
    value: errors,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

export const normalizeAggregateErrors = function (error, AnyError) {
  if (!Array.isArray(error.errors)) {
    return
  }

  const errorsA = error.errors.map(AnyError.normalize)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'errors', {
    value: errorsA,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}
