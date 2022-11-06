import isErrorInstance from 'is-error-instance'

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
export const normalizeCause = function ({
  message,
  opts,
  opts: { cause },
  AnyError,
  isAnyNormalize,
}) {
  if (!('cause' in opts)) {
    return { message, opts }
  }

  if (!isAnyNormalize) {
    return { message, opts: { ...opts, cause: AnyError.normalize(cause) } }
  }

  const messageA = hasSpecificName(cause) ? `${cause.name}:` : message
  return { message: messageA, opts: { ...opts, cause } }
}

const hasSpecificName = function (cause) {
  return isErrorInstance(cause) && !GENERIC_NAMES.has(cause.name)
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
