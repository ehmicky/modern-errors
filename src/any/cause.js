import mergeErrorCause from 'merge-error-cause'

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
  if (cause instanceof AnyError) {
    return cause
  }

  const message = hasErrorName(cause) ? `${cause.name}:` : ''
  return new UnknownError(message, { cause })
}

// `new AnyError()` should wrap the name, as opposed to other error classes
// which override it. So when it converts to `UnknownError`, the former name
// is prepended to `error.message` unless it is a generic `Error`.
const hasErrorName = function (cause) {
  return (
    isErrorInstance(cause) &&
    typeof cause.name === 'string' &&
    cause.name !== 'Error'
  )
}

const isErrorInstance = function (cause) {
  return Object.prototype.toString.call(cause) === '[object Error]'
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
