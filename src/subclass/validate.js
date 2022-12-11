import { classesData } from './map.js'

// We forbid subclasses that are not known, i.e. not passed to
// `ErrorClass.subclass()`
//  - They would not be validated at load time
//  - The class would not be normalized until its first instantiation
//     - E.g. its `prototype.name` might be missing
//  - The list of `ErrorClasses` would be potentially incomplete
//     - E.g. `ErrorClass.parse()` would not be able to parse an error class
//       until its first instantiation
// This usually happens if a class was:
//  - Not passed to the `custom` option of `*Error.subclass()`
//  - But was extended from a known class
export const validateSubclass = (ErrorClass) => {
  if (classesData.has(ErrorClass)) {
    return
  }

  const { name } = ErrorClass
  const { name: parentName } = Object.getPrototypeOf(ErrorClass)
  throw new Error(
    `"new ${name}()" must not be directly called.
This error class should be created like this instead:
  export const ${name} = ${parentName}.subclass('${name}')`,
  )
}
