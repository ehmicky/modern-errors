import isErrorInstance from 'is-error-instance'
import mergeErrorCause from 'merge-error-cause'
import setErrorMessage from 'set-error-message'

// Like `mergeCause()` but run outside of `new AnyError(...)`
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
//  - Users expect the instance class to match the constructor being used
//  - Setting a class only if `error.cause` is not `instanceof AnyError` can
//    sometimes be needed
//     - However it usually indicates a catch block that is too wide, which
//       is discouraged
// However, if `error.cause` has the same class or a child class, we keep it
// instead
//  - This allows using `new AnyError(...)` to wrap an error without changing
//    its class
//  - This returns a subclass of the parent class, which does not break
//    inheritance nor user expectations
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

// When switching error classes, we keep the old class name in the error
// message, except:
//  - When the error name is absent or is too generic
//  - When wrapping a child class
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
  'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  'AggregateError',
  'AnyError',
])

const addSpecificName = function (cause) {
  const oldMessage = typeof cause.message === 'string' ? cause.message : ''
  const newMessage =
    oldMessage === '' ? cause.name : `${cause.name}: ${oldMessage}`
  return { oldMessage, newMessage }
}
