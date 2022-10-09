import normalizeException from 'normalize-exception'

import { validateNonEmpty } from './subclass.js'

// Normalizer ensures its class is among an allowed list of classes.
// Otherwise, we convert it to a new `UnknownError`.
// This returns the `error` instead of throwing it so the user can handle it
// before re-throwing it if needed.
// This is called `normalize()`, not `normalizeError()` so it does not end
// like the error classes.
// We let any exceptions from custom constructors propagate.
export const normalize = function (error, AnyError, ErrorClasses) {
  validateNonEmpty(ErrorClasses)
  const errorA =
    error instanceof AnyError
      ? error
      : new ErrorClasses.UnknownError.ErrorClass('', { cause: error })
  return normalizeException(errorA)
}
