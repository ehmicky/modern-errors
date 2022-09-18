import isPlainObj from 'is-plain-obj'

// Unknown `Error` options are not validated, for compatibility with any
// potential JavaScript platform, since `error` has many non-standard elements.
//   - This also ensures compatibility with future JavaScript features or with
//     any `Error` polyfill
// We allow `undefined` message since it is allowed by the standard, internally
// normalized to an empty string
//  - However, we do not allow it to be optional, i.e. options are always the
//    second object, and empty strings must be used to ignore messages, since
//    this is:
//     - More standard
//     - More monomorphic
//     - Safer against injections
export const normalizeConstructorArgs = function ({
  opts = {},
  UnknownError,
  BaseError,
  isAnyError,
}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(
      `Error options must be a plain object or undefined: ${opts}`,
    )
  }

  if (opts.custom !== undefined) {
    throw new TypeError(
      `Error option "custom" must be passed to "modernErrors()", not to error constructors.`,
    )
  }

  return normalizeCause({ opts, UnknownError, BaseError, isAnyError })
}

// `new AnyError()` does not make sense without a `cause`, so we validate it
//  - We allow `cause: undefined` since `undefined` exceptions can be thrown
//  - However, we set to it an empty `UnknownError` then as this ensures:
//     - `AnyError` class is not kept
//     - A similar behavior as other error classes with undefined causes,
//       i.e. the message and stack are not changed
// If the error is not from a known class or `UnknownError`, we wrap it in
// `UnknownError` to ensure `AnyError` instance type is a child of `AnyError`.
const normalizeCause = function ({
  opts,
  UnknownError,
  BaseError,
  isAnyError,
}) {
  if (!isAnyError) {
    return opts
  }

  if (!('cause' in opts)) {
    throw new Error(
      '"cause" must be passed to the second argument of: new AnyError("message", { cause })',
    )
  }

  const cause = getCause(opts.cause, UnknownError, BaseError)
  return { ...opts, cause }
}

const getCause = function (cause, UnknownError, BaseError) {
  return cause instanceof BaseError ? cause : new UnknownError('', { cause })
}
