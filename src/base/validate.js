// Ensure the subclass is valid
export const validateClass = function ({
  ChildError,
  BaseError,
  GlobalBaseError,
  KnownClasses,
  isAnyError,
}) {
  validateExtended(ChildError, BaseError, GlobalBaseError)
  validateRegistered(ChildError, KnownClasses, isAnyError)
}

// `BaseError` and `GlobalBaseError` are internal and should not be used
// directly
const validateExtended = function (ChildError, BaseError, GlobalBaseError) {
  if (ChildError === BaseError || ChildError === GlobalBaseError) {
    throw new Error(
      `${ChildError.name} cannot be instantiated, but its subclasses can.`,
    )
  }
}

// We forbid subclasses that are not known, i.e. not passed to the main method
//  - They would not be validated at load time
//  - The class would not be normalized until its first instantiation
//     - E.g. its `prototype.name` might be missing
//  - The list of known classes would be potentially incomplete
//     - E.g. `AnyError.parse()` would not be able to parse an error class until
//       its first instantiation
//     - Also, `UnknownError` might be missing during `AnyError.normalize()`
const validateRegistered = function (ChildError, KnownClasses, isAnyError) {
  if (!Object.values(KnownClasses).includes(ChildError) && !isAnyError) {
    throw new Error(
      `"${ChildError.name}" must be passed to "modernErrors()" before being instantiated.`,
    )
  }
}
