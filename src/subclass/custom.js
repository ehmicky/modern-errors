import { setErrorName } from 'error-class-utils'

import { setInheritedMethods } from './inherited.js'
import { validateCustom } from './parent.js'

// The `custom` option can be used to customize a specific error class.
// It must extend directly from `AnyError`.
// We use a thin child class instead of `custom` directly since this allows:
//  - Mutating it, e.g. its `name`, without modifying the `custom` option
//  - Creating several classes with the same `custom` option
// `setErrorName()` also checks that `name` is a string and is not one of the
// native error classes.
// `custom` instance properties and errors set after instantiation can always
// override any other property
//  - Including error core properties, `plugin.properties()`, instance|static
//    methods
//  - Reasons:
//     - It is not possible for `BaseError` to check its child class since it
//       is called afterwards
//     - It allows for some useful overrides like `toJSON()`
//     - It prevents user-defined `props` from overriding `custom` properties
// This does not apply to static methods because:
//  - They can be checked
//  - Overriding can be done through a different method
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
