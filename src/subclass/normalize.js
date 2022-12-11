import normalizeException from 'normalize-exception'

import { setNonEnumProp } from '../utils/descriptors.js'
import { isSubclass } from '../utils/subclass.js'

// `ErrorClass.normalize()` has two purposes:
//  - Normalizing exceptions:
//     - Inside any `catch` block
//     - To:
//        - Error instances with normal properties
//        - Instances of `ModernError` (or any subclass), so plugin instance
//          methods can be called
//     - This is meant to be called as `BaseError.normalize(error)`
//  - Assigning a default class:
//     - Inside a top-level `catch` block
//     - For errors that are generic, either:
//        - Not `BaseError` instances
//        - `BaseError` itself
//     - This is meant to be called as
//       `BaseError.normalize(error, UnknownError)`
// `BaseError` is meant as a placeholder class
//  - It should be replaced by a subclass in a parent `catch` block
//  - This is useful when wrapping or normalizing errors
//  - By opposition, `BaseError.normalize(error, UnknownError)` should be
//    top-level, to ensure no parent `catch` block changes the class to a more
//    precise one, since this would keep `UnknownError` class options
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
// This is called `normalize()`, not `normalizeError()` so it does not end
// like the error classes.
export const normalize = (ErrorClass, error, UnknownError = ErrorClass) => {
  if (!isSubclass(UnknownError, ErrorClass)) {
    throw new TypeError(
      `${ErrorClass.name}.normalize()'s second argument should be a subclass of ${ErrorClass.name}, not: ${UnknownError}`,
    )
  }

  return normalizeError({ error, ErrorClass, UnknownError, parents: [] })
}

const normalizeError = ({ error, ErrorClass, UnknownError, parents }) => {
  normalizeAggregateErrors({ error, ErrorClass, UnknownError, parents })
  return shouldKeepClass(error, ErrorClass, UnknownError)
    ? normalizeException(error, { shallow: true })
    : new UnknownError('', { cause: error })
}

// `error.errors` are normalized before `error` so that if some are missing a
// stack trace, the generated stack trace is coming from `new ErrorClass()`
// instead of `normalizeException()`, since this is a nicer stack
const normalizeAggregateErrors = ({
  error,
  ErrorClass,
  UnknownError,
  parents,
}) => {
  if (!Array.isArray(error?.errors)) {
    return
  }

  const parentsA = [...parents, error]
  const errors = error.errors
    .filter((aggregateError) => !parentsA.includes(aggregateError))
    .map((aggregateError) =>
      normalizeError({
        error: aggregateError,
        ErrorClass,
        UnknownError,
        parents: parentsA,
      }),
    )
  setNonEnumProp(error, 'errors', errors)
}

const shouldKeepClass = (error, ErrorClass, UnknownError) =>
  error?.constructor === UnknownError ||
  (error instanceof ErrorClass && error.constructor !== ErrorClass)
