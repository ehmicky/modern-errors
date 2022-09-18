import { setErrorName } from 'error-class-utils'

import { setInheritedMethods } from './inherited.js'
import { validateCustom } from './validate.js'

// The `custom` option can be used to customize a specific error class.
// It must extend directly from `AnyError`.
// We use a thin child class instead of `custom` directly since this allows:
//  - Mutating it, e.g. its `name`, without modifying the `custom` option
//  - Creating several classes with the same `custom` option
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes.
// We allow `ErrorClass.class()` to create subclasses.
export const getErrorClass = function ({
  ParentError,
  className,
  custom,
  plugins,
}) {
  const ClassParent = getClassParent(custom, ParentError)
  const ErrorClass = class extends ClassParent {}
  setErrorName(ErrorClass, className)
  setInheritedMethods({ ErrorClass, custom, plugins, className })
  return ErrorClass
}

const getClassParent = function (custom, ParentError) {
  if (custom === undefined) {
    return ParentError
  }

  validateCustom(custom, ParentError)
  return custom
}
