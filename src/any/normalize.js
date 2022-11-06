import normalizeException from 'normalize-exception'

import { setNonEnumProp } from '../utils/descriptors.js'

// This has two purposes:
//  - Normalizing exceptions:
//     - Inside any `catch` block
//     - To:
//        - Error instances with normal properties
//        - Instances of `AnyError` (or any subclass), so plugin instance
//          methods can be called
//     - This is meant to be called as `AnyError.normalize()`
//  - Assigning a default class:
//     - Inside a top-level `catch` block
//     - For errors that are generic, either:
//        - Not `AnyError` instances
//        - `AnyError` itself
//     - This is meant to be called as `UnknownError.normalize()`
// `AnyError` is meant as a placeholder class
//  - It should be replaced by a subclass in a parent `catch` block
//  - This is useful when wrapping or normalizing errors
//  - By opposition, `UnknownError.normalize()` should be top-level, to ensure
//    no parent `catch` block changes the class to a more precise one, since
//    this would keep `UnknownError` class options
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
// This is called `normalize()`, not `normalizeError()` so it does not end
// like the error classes.
export const normalize = function ({ ErrorClass, AnyError }, error) {
  return normalizeError({ error, ErrorClass, AnyError, parents: [] })
}

const normalizeError = function ({ error, ErrorClass, AnyError, parents }) {
  if (parents.includes(error)) {
    return error
  }

  const errorA = normalizeAggregateErrors({
    error,
    ErrorClass,
    AnyError,
    parents,
  })
  return shouldKeepClass(errorA, ErrorClass, AnyError)
    ? normalizeException(errorA, { shallow: true })
    : new ErrorClass('', { cause: errorA })
}

// `error.errors` are normalized before `error` so that if some are missing a
// stack trace, the generated stack trace is coming from `new ErrorClass()`
// instead of `normalizeException()`, since this is a nicer stack
const normalizeAggregateErrors = function ({
  error,
  ErrorClass,
  AnyError,
  parents,
}) {
  if (!Array.isArray(error.errors)) {
    return error
  }

  const errorsA = error.errors.map((aggregateError) =>
    normalizeError({
      error: aggregateError,
      ErrorClass,
      AnyError,
      parents: [...parents, error],
    }),
  )
  setNonEnumProp(error, 'errors', errorsA)
  return error
}

const shouldKeepClass = function (error, ErrorClass, AnyError) {
  return (
    error.constructor === ErrorClass ||
    (error instanceof AnyError && error.constructor !== AnyError)
  )
}
