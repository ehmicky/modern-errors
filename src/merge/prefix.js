import setErrorMessage from 'set-error-message'

import { isSubclass } from '../utils/subclass.js'

// When switching error classes, we keep the old class name in the error
// message, except:
//  - When the error name is absent or is too generic
//     - Including `Error`, `TypeError`, etc. except when `error.name` has been
//       set to something else, since this is a common pattern
//  - When the child is a subclass of the parent, since the class does not
//    change then
//  - When the parent is a subclass of the child, since the new class becomes
//    the subclass, which already contains the other class in its chain, i.e.
//    not worth adding to the message
export const shouldPrefixCause = function (error, ErrorClass) {
  const { cause } = error
  return (
    hasValidName(cause) &&
    (hasUsefulName(cause, ErrorClass) || cause.name !== cause.constructor.name)
  )
}

const hasValidName = function (cause) {
  return (
    typeof cause.name === 'string' &&
    cause.name !== '' &&
    typeof cause.constructor === 'function' &&
    typeof cause.constructor.name === 'string'
  )
}

const hasUsefulName = function (cause, ErrorClass) {
  return !(
    isSubclass(cause.constructor, ErrorClass) ||
    isSubclass(ErrorClass, cause.constructor) ||
    cause.constructor.name in globalThis
  )
}

// Prefix `cause.name` to its `message`
export const prefixCause = function (cause) {
  const oldMessage = typeof cause.message === 'string' ? cause.message : ''
  const newMessage =
    oldMessage === '' ? cause.name : `${cause.name}: ${oldMessage}`
  setErrorMessage(cause, newMessage)
  return oldMessage
}

// Undo prefixing once it's been used by `merge-error-cause`
export const undoPrefixCause = function (cause, oldMessage) {
  setErrorMessage(cause, oldMessage)
}
