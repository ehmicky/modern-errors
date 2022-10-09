// `new UnknownError('', { cause })` keeps the underlying error name in the
// message so it is not lost.
//  - This also applies when using `new AnyError()`
//  - This does not apply when the name is a generic error class or
//    `UnknownError` itself
export const keepCauseMessage = function (
  message,
  isSimpleUnknownError,
  { cause },
) {
  return isSimpleUnknownError && hasErrorName(cause)
    ? `${cause.name}:`
    : message
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
  isAnyError,
  isSimpleUnknownError,
}) {
  validateAnyErrorCause(opts, isAnyError)
  return hasUnknownCause(opts, AnyError, isSimpleUnknownError)
    ? { ...opts, cause: createSimpleUnknownError(UnknownError, opts) }
    : opts
}

// `new AnyError()` does not make sense without a `cause`, so we validate it.
const validateAnyErrorCause = function (opts, isAnyError) {
  if (!('cause' in opts) && isAnyError) {
    throw new Error(
      '"cause" must be passed to the second argument of: new AnyError("message", { cause })',
    )
  }
}

const hasUnknownCause = function (opts, AnyError, isSimpleUnknownError) {
  return (
    'cause' in opts &&
    !(opts.cause instanceof AnyError) &&
    !isSimpleUnknownError
  )
}

const createSimpleUnknownError = function (UnknownError, { cause }) {
  return new UnknownError('', { cause })
}

export const getIsSimpleUnknownError = function (
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
