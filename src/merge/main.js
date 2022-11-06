import isErrorInstance from 'is-error-instance'
import mergeErrorCause from 'merge-error-cause'

import { isSubclass } from '../utils/subclass.js'

import { shouldPrefixCause, prefixCause, undoPrefixCause } from './prefix.js'

// Like `mergeCause()` but run outside of `new ErrorClass(...)`
export const mergeSpecificCause = function (error, cause) {
  error.cause = cause
  error.wrap = true
  return mergeErrorCause(error)
}

// `error.cause` is merged as soon as the error is instantiated:
//  - This is simpler as it avoids the error shape to change over its lifetime
//    (before|after `ErrorClass.normalize()`)
//  - This makes it easier to debug that merging itself
//  - This allow benefitting from `cause` merging before
//    `ErrorClass.normalize()`, e.g. for improved debugging
// `error`'s class is used over `error.cause`'s since users expect the instance
// class to match the constructor being used.
// However, if `error.cause` has the same class or a child class, we keep it
// instead
//  - This allows using `new AnyError(...)` to wrap an error without changing
//    its class
//  - This returns a subclass of the parent class, which does not break
//    inheritance nor user expectations
export const mergeCause = function (error, ErrorClass) {
  const { cause } = error

  if (!isErrorInstance(cause)) {
    return mergeErrorCause(error)
  }

  error.wrap = isSubclass(cause.constructor, ErrorClass)

  if (!shouldPrefixCause(error, ErrorClass)) {
    return mergeErrorCause(error)
  }

  const oldMessage = prefixCause(cause)
  const errorA = mergeErrorCause(error)
  undoPrefixCause(cause, oldMessage)
  return errorA
}
