import { checkCustom } from './check.js'

// The `custom` option can be used to customize a specific error class.
// It must extend directly from the parent class.
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
//     - It is not possible for `ModernError` to check its child class since it
//       is called afterwards
//     - It allows for some useful overrides like `toJSON()`
//     - It prevents user-defined `props` from overriding `custom` properties
export const getErrorClass = function (ParentError, custom) {
  const ParentClass = getParentClass(ParentError, custom)
  return class extends ParentClass {}
}

const getParentClass = function (ParentError, custom) {
  if (custom === undefined) {
    return ParentError
  }

  checkCustom(custom, ParentError)
  return custom
}
