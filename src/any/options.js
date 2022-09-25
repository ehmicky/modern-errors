import isPlainObj from 'is-plain-obj'

// Unknown `Error` options are not validated, for compatibility with any
// potential JavaScript platform, since `error` has many non-standard elements.
//  - This also ensures compatibility with future JavaScript features or with
//    any `Error` polyfill
// We allow `undefined` message since it is allowed by the standard, internally
// normalized to an empty string
//  - However, we do not allow it to be optional, i.e. options are always the
//    second object, and empty strings must be used to ignore messages, since
//    this is:
//     - More standard
//     - More monomorphic
//     - Safer against injections
export const normalizeOpts = function ({
  opts = {},
  args,
  ErrorClasses: {
    UnknownError: { ErrorClass: UnknownError },
  },
  AnyError,
  isAnyError,
}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(
      `Error options must be a plain object or undefined: ${opts}`,
    )
  }

  if (opts.custom !== undefined) {
    throw new TypeError(
      'Error option "custom" must be passed to "AnyError.subclass()", not to error constructors.',
    )
  }

  validateAnyErrorArgs(isAnyError, args)

  return normalizeCause({ opts, UnknownError, AnyError, isAnyError })
}

const validateAnyErrorArgs = function (isAnyError, args) {
  if (isAnyError && args.length !== 0) {
    throw new TypeError(
      `new AnyError(...) cannot have more than two arguments: ${args[0]}`,
    )
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
const normalizeCause = function ({ opts, UnknownError, AnyError, isAnyError }) {
  if (!isAnyError) {
    return opts
  }

  if (!('cause' in opts)) {
    throw new Error(
      '"cause" must be passed to the second argument of: new AnyError("message", { cause })',
    )
  }

  const cause = getCause(opts.cause, UnknownError, AnyError)
  return { ...opts, cause }
}

const getCause = function (cause, UnknownError, AnyError) {
  return cause instanceof AnyError ? cause : new UnknownError('', { cause })
}
