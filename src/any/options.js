import isPlainObj from 'is-plain-obj'

import { keepCauseMessage, normalizeCause } from './cause.js'

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
  ErrorClasses: {
    UnknownError: { ErrorClass: UnknownError },
  },
  AnyError,
  isAnyError,
  isSimpleUnknownError,
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

  const messageA = keepCauseMessage(message, isSimpleUnknownError, opts)
  const optsA = normalizeCause({
    opts,
    UnknownError,
    AnyError,
    isAnyError,
    isSimpleUnknownError,
  })
  return { message: messageA, opts: optsA }
}

const validateAnyErrorArgs = function (isAnyError, args) {
  if (isAnyError && args.length !== 0) {
    throw new TypeError(
      `new AnyError(...) cannot have more than two arguments: ${args[0]}`,
    )
  }
}
