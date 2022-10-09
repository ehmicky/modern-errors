// If cause is not an `AnyError` instance, we convert it using
// `new UnknownError('', { cause })` to:
//  - Keep its error `name` in the error `message`
//  - Ensure `new AnyError()` return value's class is a child of `AnyError`
//  - Keep track of `showStack`
// This applies regardless of parent class:
//  - `new AnyError()`, `new KnownError()` or `new UnknownError()`
//  - With an empty message or not
export const applyConvertError = function ({
  message,
  opts,
  UnknownError,
  AnyError,
  isUnknownError,
}) {
  return isUnknownError && message === ''
    ? { message: keepCauseMessage(message, opts), opts }
    : { message, opts: normalizeCause(opts, UnknownError, AnyError) }
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

const isErrorInstance = function (cause) {
  return Object.prototype.toString.call(cause) === '[object Error]'
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
const normalizeCause = function (opts, UnknownError, AnyError) {
  return 'cause' in opts && !(opts.cause instanceof AnyError)
    ? { ...opts, cause: new UnknownError('', { cause: opts.cause }) }
    : opts
}
