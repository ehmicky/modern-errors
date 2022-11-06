import normalizeException from 'normalize-exception'

// Normalizer ensures its class is among an allowed list of classes.
// Otherwise, we convert it to a new `UnknownError`.
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
// This is called `normalize()`, not `normalizeError()` so it does not end
// like the error classes.
export const normalize = function ({ ErrorClass, AnyError }, error) {
  return error instanceof AnyError
    ? normalizeException(error)
    : new ErrorClass('', { cause: error })
}
