import { setErrorName } from 'error-class-utils'
import isPlainObj from 'is-plain-obj'

import { normalize } from './normalize.js'
import { addAllStaticMethods } from './static.js'

// Create `AnyError` class, used to wrap errors without changing their class
export const createAnyError = function ({
  state,
  globalOpts,
  BaseError,
  plugins,
}) {
  const isKnownError = hasKnownClass.bind(undefined, BaseError)

  class AnyError extends BaseError {
    constructor(message, opts) {
      validateSubClass(new.target, AnyError)
      const optsA = normalizeCause(
        opts,
        state.KnownClasses.UnknownError,
        isKnownError,
      )
      super(message, optsA)
    }

    static [Symbol.hasInstance] = isKnownError

    static normalize = normalize.bind(undefined, AnyError)
  }
  setErrorName(AnyError, 'AnyError')
  addAllStaticMethods({ plugins, globalOpts, AnyError, state })
  return AnyError
}

// `AnyError` cannot be subclassed because:
//  - It would not be possible to register it as a known error
//  - `AnyError` static methods would be inherited too which might be confusing
//  - `AnyError` class changes, which makes inheritance less useful
//     - e.g. Methods would be absent, which might be unexpected
const validateSubClass = function (ChildError, AnyError) {
  if (ChildError !== AnyError) {
    throw new Error(`AnyError must not be extended as "${ChildError.name}".`)
  }
}

// `new AnyError()` does not make sense without a `cause`, so we validate it
//  - We allow `cause: undefined` since `undefined` exceptions can be thrown
//  - However, we set to it an empty `UnknownError` then as this ensures:
//     - `AnyError` class is not kept
//     - A similar behavior as other error classes with undefined causes,
//       i.e. the message and stack are not changed
// If the error is not from a known class or `UnknownError`, we wrap it in
// `UnknownError` to ensure `AnyError` instance type is a child of `AnyError`.
const normalizeCause = function (opts, UnknownError, isKnownError) {
  if (!isPlainObj(opts) || !('cause' in opts)) {
    throw new Error(
      '"cause" must be passed to the second argument of: new AnyError("message", { cause })',
    )
  }

  const cause = getCause(opts.cause, UnknownError, isKnownError)
  return { ...opts, cause }
}

const getCause = function (cause, UnknownError, isKnownError) {
  return isKnownError(cause) ? cause : new UnknownError('', { cause })
}

// We proxy `instanceof AnyError` to `instanceof BaseError` since `BaseError`
// is not exposed.
// We encourage `instanceof` over `error.name` for checking since this:
//  - Prevents name collisions with other libraries
//  - Allows checking if any error came from a given library
//  - Includes error classes in the exported interface explicitly instead of
//    implicitly, so that users are mindful about breaking changes
//  - Bundles classes with TypeScript documentation, types and autocompletion
//  - Encourages documenting error types
// Checking class with `error.name` is still supported, but not documented
//  - Since it is widely used and can be better in specific cases
// We do not solve name collisions with the following alternatives:
//  - Namespacing all error names with a common prefix since this:
//     - Leads to verbose error names
//     - Requires either an additional option, or guessing ambiguously whether
//       error names are meant to include a namespace prefix
//     - Means special error classes (like `AnyError` or `UnknownError`) might
//       or not be namespaced which might be confusing
//  - Using a separate `namespace` property: this adds too much complexity and
//    is less standard than `instanceof`
const hasKnownClass = function (BaseError, value) {
  return value instanceof BaseError
}
