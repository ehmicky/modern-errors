import isPlainObj from 'is-plain-obj'

import { applyConvertError } from './convert.js'

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
  message,
  opts = {},
  args,
  AnyError,
  isAnyError,
  isUnknownError,
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

  validateAnyErrorArgs(isAnyError, args, opts)
  return applyConvertError({ message, opts, AnyError, isUnknownError })
}

// `new AnyError()` does not make sense without a `cause`, so we validate it.
const validateAnyErrorArgs = function (isAnyError, args, opts) {
  if (!isAnyError) {
    return
  }

  if (!('cause' in opts)) {
    throw new Error(
      '"cause" must be passed to the second argument of: new AnyError("message", { cause })',
    )
  }

  if (args.length !== 0) {
    throw new TypeError(
      `new AnyError(...) cannot have more than two arguments: ${args[0]}`,
    )
  }
}
