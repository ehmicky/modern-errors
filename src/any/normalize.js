import normalizeException from 'normalize-exception'

// This has two purposes:
//  - Normalizing exceptions:
//     - Inside any `catch` block
//     - To error instances with normal properties
//     - To instances of `AnyError` (or any subclass)
//     - This is meant to be called as `AnyError.normalize()`
//  - Assigning a default class:
//     - Inside a top-level `catch` block
//     - For errors that are not instances of `AnyError` (or any subclass)
//     - This is meant to be called as `UnknownError.normalize()`
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
// This is called `normalize()`, not `normalizeError()` so it does not end
// like the error classes.
export const normalize = function ({ ErrorClass, AnyError }, error) {
  return error instanceof AnyError &&
    !(error.constructor === AnyError && ErrorClass !== AnyError)
    ? normalizeException(error)
    : new ErrorClass('', { cause: error })
}
