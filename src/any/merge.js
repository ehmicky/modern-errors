import isErrorInstance from 'is-error-instance'
import mergeErrorCause from 'merge-error-cause'
import setErrorMessage from 'set-error-message'

// Like `mergeCause()` but run outside of `AnyError` constructor
export const mergeSpecificCause = function (error, cause) {
  error.cause = cause
  error.wrap = true
  return mergeErrorCause(error)
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
//  - Setting a class only if `error.cause` is not `instanceof AnyError` can
//    sometimes be needed
//     - However it usually indicates a catch block that is too wide, which
//       is discouraged
export const mergeCause = function (error, ErrorClass) {
  const { cause } = error
  const wrap = cause instanceof ErrorClass
  error.wrap = wrap

  if (wrap || !hasSpecificName(cause)) {
    return mergeErrorCause(error)
  }

  const { oldMessage, newMessage } = addSpecificName(cause)
  setErrorMessage(cause, newMessage)
  const errorA = mergeErrorCause(error)
  setErrorMessage(cause, oldMessage)
  return errorA
}

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
const hasSpecificName = function (cause) {
  return (
    isErrorInstance(cause) &&
    typeof cause.name === 'string' &&
    !GENERIC_NAMES.has(cause.name)
  )
}

// The error name is not kept if generic
const GENERIC_NAMES = new Set([
  '',
  // 'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  'AggregateError',
])

const addSpecificName = function (cause) {
  const oldMessage = typeof cause.message === 'string' ? cause.message : ''
  const newMessage =
    oldMessage === '' ? cause.name : `${cause.name}: ${oldMessage}`
  return { oldMessage, newMessage }
}
