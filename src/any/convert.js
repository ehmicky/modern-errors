import isErrorInstance from 'is-error-instance'
import normalizeException from 'normalize-exception'

// If `cause` is not an `AnyError` instance, we convert it using
// `AnyError.normalize()` to:
//  - Keep its error `name` in the error `message`
//  - Ensure `new AnyError()` return value's class is a child of `AnyError`
//  - Keep track of `showStack`
// This applies regardless of parent class:
//  - `new AnyError()`, `new KnownError()` or `new UnknownError()`
//  - With an empty message or not
export const applyConvertError = function ({
  message,
  opts,
  AnyError,
  isUnknownError,
}) {
  return isUnknownError && message === ''
    ? { message: keepCauseMessage(message, opts), opts: normalizeThis(opts) }
    : { message, opts: normalizeCause(opts, AnyError) }
}

const normalizeThis = function (opts) {
  return 'cause' in opts
    ? { ...opts, cause: normalizeException(opts.cause) }
    : opts
}

const keepCauseMessage = function (message, { cause }) {
  return hasErrorName(cause) ? `${cause.name}:` : message
}

const hasErrorName = function (cause) {
  return (
    cause !== undefined &&
    isErrorInstance(cause) &&
    typeof cause.name === 'string' &&
    !GENERIC_NAMES.has(cause.name)
  )
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

// We allow `cause: undefined` since `undefined` exceptions can be thrown.
const normalizeCause = function (opts, AnyError) {
  return 'cause' in opts
    ? { ...opts, cause: AnyError.normalize(opts.cause) }
    : opts
}
