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
//     - It is not possible for `AnyError` to check its child class since it is
//       called afterwards
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

  validateCustom(custom, ParentError)
  return custom
}

const validateCustom = function (custom, ParentError) {
  if (typeof custom !== 'function') {
    throw new TypeError(`The "custom" property must be a class: ${custom}`)
  }

  validateParent(custom, ParentError)
  validatePrototype(custom)
}

// We do not allow passing `ParentError` without extending from it, since
// `undefined` can be used for it instead.
// We do not allow extending from `ParentError` indirectly:
//  - This promotes using subclassing through `ErrorClass.subclass()`, since it
//    reduces the risk of user instantiating unregistered class
//  - This promotes `ErrorClass.subclass()` as a pattern for subclassing, to
//    reduce the risk of directly extending a registered class without
//    registering the subclass
const validateParent = function (custom, ParentError) {
  if (custom === ParentError) {
    throw new TypeError(
      `The "custom" class must extend from ${ParentError.name}, but not be ${ParentError.name} itself.`,
    )
  }

  if (Object.getPrototypeOf(custom) !== ParentError) {
    throw new TypeError(
      `The "custom" class must extend directly from ${ParentError.name}.\n\n${custom}`,
    )
  }
}

const validatePrototype = function (custom) {
  if (typeof custom.prototype !== 'object' || custom.prototype === null) {
    throw new TypeError(
      `The "custom" class's prototype is invalid: ${custom.prototype}`,
    )
  }

  if (custom.prototype.constructor !== custom) {
    throw new TypeError(
      'The "custom" class has an invalid "constructor" property.',
    )
  }
}
