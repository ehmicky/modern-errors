import normalizeException from 'normalize-exception'

// If `cause` is not an `AnyError` instance, we convert it using
// `AnyError.normalize()` to:
//  - Keep its error `name` in the error `message`
//  - Ensure `new AnyError()` return value's class is a child of `AnyError`
// This applies regardless of parent class:
//  - `new AnyError()`, `new KnownError()` or `new UnknownError()`
//  - With an empty message or not
// `undefined` causes are not ignored when the `cause` key is defined:
//  - This is because `new AnyError()` requires a `cause`, which might be a
//    legitimate `undefined` error
//  - Other error classes have the same behavior for consistency with `AnyError`
//  - This makes the behavior different from:
//     - `normalize-exception` and `merge-error-cause`
//     - Other options (`errors` and plugin options)
export const normalizeCause = function ({
  message,
  opts,
  AnyError,
  isAnyNormalize,
}) {
  if (!('cause' in opts)) {
    return { message, opts }
  }

  if (!isAnyNormalize) {
    return { message, opts: { ...opts, cause: AnyError.normalize(opts.cause) } }
  }

  const cause = normalizeException(opts.cause)
  const messageA = GENERIC_NAMES.has(cause.name) ? message : `${cause.name}:`
  return { message: messageA, opts: { ...opts, cause } }
}

// The error name is not kept if generic or `UnknownError` itself
const GENERIC_NAMES = new Set([
  'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  'AggregateError',
  'UnknownError',
])
