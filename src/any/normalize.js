import normalizeException from 'normalize-exception'

// Normalizer ensures its class is among an allowed list of classes.
// Otherwise, wrap as `cause` for a new `UnknownError`.
//  - Do it by wrapping in an `AnyError`, so that the shape is the same as when
//   `AnyError` wraps any other error
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
// This is called `normalize()`, not `normalizeError()` so it does not end
// like the error classes.
// We let any exceptions from custom constructors propagate.
export const normalize = function (error, AnyError) {
  const errorA =
    error instanceof AnyError ? error : new AnyError('', { cause: error })
  return normalizeException(errorA)
}
