// Validate `custom` option
export const validateCustom = function (custom, ParentError) {
  if (typeof custom !== 'function') {
    throw new TypeError(`The "custom" property must be a class: ${custom}`)
  }

  validateParent(custom, ParentError)
  validatePrototype(custom)
}

// We do not allow passing `ParentError` without extending from it, since
// `undefined` can be used for it instead.
// We do not allow extending from `ParentError` indirectly:
//  - This promotes using subclassing through `ErrorClass.class()`, since it
//    reduces the risk of user instantiating unregistered class
//  - This promotes `ErrorClass.class()` as a pattern for subclassing, to
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
