import mergeErrorCause from 'merge-error-cause'

// `new UnknownError('', { cause })` keeps the underlying error name in the
// message so it is not lost.
//  - This also applies when using `new AnyError()`
//  - This does not apply when either:
//     - The message is not empty, since it might either be prepended or
//       appended then, making concatenation more complex
//     - The name is a generic `Error`, or `UnknownError` itself
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

const GENERIC_NAMES = new Set(['Error', 'UnknownError'])

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

// Retrieve `error.cause` unless it is unknown
export const getCause = function ({ cause }, AnyError) {
  return cause instanceof AnyError ? cause : undefined
}

// `error.cause` is merged as soon as the error is instantiated:
//  - This is simpler as it avoids the error shape to change over its lifetime
//    (before|after `AnyError.normalize()`)
//  - This makes it easier to debug that merging itself
//  - This allow benefitting from `cause` merging before `AnyError.normalize()`,
//    e.g. for improved debugging
// `error`'s class is used over `error.cause`'s since:
//  - `AnyError` can be used to reverse this
//  - This ensures the instance class is the same as the constructor being used,
//    which is expected
//     - `AnyError` class does not change, but only to a child class
//  - Setting a class only if `error.cause`'s class is unknown can sometimes
//    be needed
//     - However it usually indicates a catch block that is too wide, which
//       is discouraged
export const mergeCause = function (error, wrap) {
  error.wrap = wrap
  return mergeErrorCause(error)
}

// Like `mergeCause()` but run outside of `AnyError` constructor
export const mergeSpecificCause = function (error, cause) {
  error.cause = cause
  return mergeCause(error, true)
}
