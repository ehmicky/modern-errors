// We forbid subclasses that are not known, i.e. not passed to
// `AnyError.create()`
//  - They would not be validated at load time
//  - The class would not be normalized until its first instantiation
//     - E.g. its `prototype.name` might be missing
//  - The list of known classes would be potentially incomplete
//     - E.g. `AnyError.parse()` would not be able to parse an error class until
//       its first instantiation
// This usually happens if either:
//  - A class extending from `AnyError` was not passed as `custom` option to
//    `AnyError.create()`
//  - A class was extended from a known class, without being passed itself to
//    `AnyError.create()`
export const validateClass = function (ChildError, KnownClasses, isAnyError) {
  if (!Object.values(KnownClasses).includes(ChildError) && !isAnyError) {
    throw new Error(
      `"${ChildError.name}" must be passed as a "custom" option with "AnyError.create()" before being instantiated.`,
    )
  }
}
