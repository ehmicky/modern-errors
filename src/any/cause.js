import normalizeException from 'normalize-exception'

// If `cause` is not an `AnyError` instance, we convert it using
// `AnyError.normalize()` to:
//  - Keep its error `name` in the error `message`
//  - Ensure `new AnyError()` return value's class is a child of `AnyError`
//  - Keep track of `showStack`
// This applies regardless of parent class:
//  - `new AnyError()`, `new KnownError()` or `new UnknownError()`
//  - With an empty message or not
// We allow `cause: undefined` since `undefined` exceptions can be thrown.
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

  const causeA = normalizeException(opts.cause)
  const messageA = GENERIC_NAMES.has(causeA.name) ? message : `${causeA.name}:`
  return { message: messageA, opts: { ...opts, cause: causeA } }
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
