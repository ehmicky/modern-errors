import { requireUnknownError } from '../class/unknown.js'

// We forbid subclasses that are not known, i.e. not passed to
// `AnyError.class()`
//  - They would not be validated at load time
//  - The class would not be normalized until its first instantiation
//     - E.g. its `prototype.name` might be missing
//  - The list of `ErrorClasses` would be potentially incomplete
//     - E.g. `AnyError.parse()` would not be able to parse an error class until
//       its first instantiation
// This usually happens if a class was:
//  - Not passed to the `custom` option of `AnyError.class()`
//  - But was extended from either `AnyError` or a known class
export const validateSubClass = function (ChildError, AnyError, ErrorClasses) {
  requireUnknownError(ErrorClasses)

  if (ChildError === AnyError) {
    return true
  }

  if (ErrorClasses[ChildError.name] === undefined) {
    throw new Error(
      `"${ChildError.name}" must be passed to the "custom" option of "AnyError.class()" before being instantiated.`,
    )
  }

  return false
}
