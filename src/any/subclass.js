import { requireUnknownError } from '../class/unknown.js'

// We forbid subclasses that are not known, i.e. not passed to
// `*Error.class()`
//  - They would not be validated at load time
//  - The class would not be normalized until its first instantiation
//     - E.g. its `prototype.name` might be missing
//  - The list of `ErrorClasses` would be potentially incomplete
//     - E.g. `AnyError.parse()` would not be able to parse an error class until
//       its first instantiation
// This usually happens if a class was:
//  - Not passed to the `custom` option of `*Error.class()`
//  - But was extended from either `AnyError` or a known class
export const validateSubClass = function (ChildError, AnyError, ErrorClasses) {
  requireUnknownError(ErrorClasses)
  const isAnyError = ChildError === AnyError
  validateRegisteredClass(ChildError, isAnyError, ErrorClasses)
  return isAnyError
}

const validateRegisteredClass = function (
  ChildError,
  isAnyError,
  ErrorClasses,
) {
  const { name } = ChildError

  if (isAnyError || ErrorClasses[name] !== undefined) {
    return
  }

  const { name: parentName } = Object.getPrototypeOf(ChildError)
  throw new Error(
    `"new ${name}()" must not be directly called.
The following error class should be used instead:
  export const ${name} = ${parentName}.class('${name}', { custom: ${name} })`,
  )
}
