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

// `new UnknownError('', { cause })` keeps the underlying error name in the
// message so it is not lost.
//  - This also applies when using `new AnyError()`
//  - This does not apply when the name is a generic error class or
//    `UnknownError` itself
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

// If cause is not an `AnyError` instance, we wrap it in `UnknownError`:
//  - This keeps the `cause` error name (unless it is generic)
//  - This ensures `AnyError` instance type is a child of `AnyError`
//  - We allow `cause: undefined` since `undefined` exceptions can be thrown
const normalizeCause = function (opts, UnknownError, AnyError) {
  return 'cause' in opts && !(opts.cause instanceof AnyError)
    ? { ...opts, cause: new UnknownError('', { cause: opts.cause }) }
    : opts
}
