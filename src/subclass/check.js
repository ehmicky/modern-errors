import { isSubclass } from '../utils/subclass.js'

// Confirm `custom` option is valid
export const checkCustom = function (custom, ParentError) {
  if (typeof custom !== 'function') {
    throw new TypeError(
      `The "custom" class of "${ParentError.name}.subclass()" must be a class: ${custom}`,
    )
  }

  checkParent(custom, ParentError)
  checkPrototype(custom, ParentError)
}

// We do not allow passing `ParentError` without extending from it, since
// `undefined` can be used for it instead.
// We do not allow extending from `ParentError` indirectly:
//  - This promotes using subclassing through `ErrorClass.subclass()`, since it
//    reduces the risk of user instantiating unregistered class
//  - This promotes `ErrorClass.subclass()` as a pattern for subclassing, to
//    reduce the risk of directly extending a registered class without
//    registering the subclass
const checkParent = function (custom, ParentError) {
  if (custom === ParentError) {
    throw new TypeError(
      `The "custom" class of "${ParentError.name}.subclass()" must extend from ${ParentError.name}, but not be ${ParentError.name} itself.`,
    )
  }

  if (!isSubclass(custom, ParentError)) {
    throw new TypeError(
      `The "custom" class of "${ParentError.name}.subclass()" must extend from ${ParentError.name}.`,
    )
  }

  if (Object.getPrototypeOf(custom) !== ParentError) {
    throw new TypeError(
      `The "custom" class of "${ParentError.name}.subclass()" must extend directly from ${ParentError.name}.`,
    )
  }
}

const checkPrototype = function (custom, ParentError) {
  if (typeof custom.prototype !== 'object' || custom.prototype === null) {
    throw new TypeError(
      `The "custom" class's prototype of "${ParentError.name}.subclass()" is invalid: ${custom.prototype}`,
    )
  }

  if (custom.prototype.constructor !== custom) {
    throw new TypeError(
      `The "custom" class of "${ParentError.name}.subclass()" has an invalid "constructor" property.`,
    )
  }
}
