// `new UnknownError('', { cause })` keeps the underlying error name in the
// message so it is not lost.
//  - This also applies when using `new AnyError()`
//  - This does not apply when either:
//     - The message is not empty, since it might either be prepended or
//       appended then, making concatenation more complex
//     - The name is a generic error class, or `UnknownError` itself
export const keepCauseMessage = function (message, isUnknownError, { cause }) {
  return isUnknownError && message === '' && hasErrorName(cause)
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

// `new AnyError()` does not make sense without a `cause`, so we validate it
//  - We allow `cause: undefined` since `undefined` exceptions can be thrown
//  - However, we set to it an empty `UnknownError` then as this ensures:
//     - `AnyError` class is not kept
//     - A similar behavior as other error classes with undefined causes,
//       i.e. the message and stack are not changed
// If the error is not from a known class or `UnknownError`, we wrap it in
// `UnknownError` to ensure `AnyError` instance type is a child of `AnyError`.
export const normalizeCause = function ({
  opts,
  UnknownError,
  AnyError,
  isAnyError,
}) {
  if (!isAnyError) {
    return opts
  }

  if (!('cause' in opts)) {
    throw new Error(
      '"cause" must be passed to the second argument of: new AnyError("message", { cause })',
    )
  }

  const cause = getCauseOpt(opts.cause, UnknownError, AnyError)
  return { ...opts, cause }
}

const getCauseOpt = function (cause, UnknownError, AnyError) {
  return cause instanceof AnyError ? cause : new UnknownError('', { cause })
}
