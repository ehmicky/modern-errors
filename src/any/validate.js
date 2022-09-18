// We forbid subclasses that are not known, i.e. not passed to the main method
//  - They would not be validated at load time
//  - The class would not be normalized until its first instantiation
//     - E.g. its `prototype.name` might be missing
//  - The list of known classes would be potentially incomplete
//     - E.g. `AnyError.parse()` would not be able to parse an error class until
//       its first instantiation
//     - Also, `UnknownError` might be missing during `AnyError.normalize()`
export const validateClass = function (ChildError, KnownClasses, isAnyError) {
  if (!Object.values(KnownClasses).includes(ChildError) && !isAnyError) {
    throw new Error(
      `"${ChildError.name}" must be passed to "modernErrors()" before being instantiated.`,
    )
  }
}
