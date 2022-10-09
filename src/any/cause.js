// `new UnknownError('', { cause })` keeps the underlying error name in the
// message so it is not lost.
//  - This also applies when using `new AnyError()`
//  - This does not apply when the name is a generic error class or
//    `UnknownError` itself
export const keepCauseMessage = function (message, isConvertError, { cause }) {
  return isConvertError && hasErrorName(cause) ? `${cause.name}:` : message
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
export const normalizeCause = function ({
  opts,
  UnknownError,
  AnyError,
  isConvertError,
}) {
  return hasUnknownCause(opts, AnyError, isConvertError)
    ? { ...opts, cause: createConvertError(UnknownError, opts) }
    : opts
}

const hasUnknownCause = function (opts, AnyError, isConvertError) {
  return 'cause' in opts && !(opts.cause instanceof AnyError) && !isConvertError
}

const createConvertError = function (UnknownError, { cause }) {
  return new UnknownError('', { cause })
}

export const getIsConvertError = function (
  NewTarget,
  { UnknownError: { ErrorClass: UnknownError } },
  message,
) {
  return (
    (NewTarget === UnknownError ||
      Object.prototype.isPrototypeOf.call(UnknownError, NewTarget)) &&
    message === ''
  )
}
