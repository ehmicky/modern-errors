import isErrorInstance from 'is-error-instance'
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
export const normalizeOpts = function (ErrorClass, message, opts = {}) {
  if (!isPlainObj(opts)) {
    throw new TypeError(
      `Error options must be a plain object or undefined: ${opts}`,
    )
  }

  if (opts.custom !== undefined) {
    throw new TypeError(
      `Error option "custom" must be passed to "${ErrorClass.name}.subclass()", not to error constructors.`,
    )
  }

  // TODO: fix. This should work regardless of whether appended or prepended
  // const messageA = hasSpecificName(opts.cause, ErrorClass)
  //   ? `${opts.cause.name}: ${message}`
  //   : message
  return { message, opts }
}

// If `cause` is not an `AnyError` instance, we convert it using
// `AnyError.normalize()` to:
//  - Keep its error `name` in the error `message`
//  - Ensure `new AnyError()` return value's class is a child of `AnyError`
// This applies regardless of parent class:
//  - `new AnyError()`, `new KnownError()` or `new UnknownError()`
//  - With an empty message or not
// `undefined` causes are ignored when the `cause` key is defined, for
// consistency with:
//  - `normalize-exception` and `merge-error-cause`
//  - Other options (`errors` and plugin options)
const hasSpecificName = function (cause, ErrorClass) {
  return (
    isErrorInstance(cause) &&
    !(cause instanceof ErrorClass) &&
    !GENERIC_NAMES.has(cause.name)
  )
}

// The error name is not kept if generic
const GENERIC_NAMES = new Set([
  'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  'AggregateError',
])
