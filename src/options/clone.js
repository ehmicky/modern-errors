import isPlainObj from 'is-plain-obj'

// Deep clone an object except for class instances.
// This is done on:
//  - Plugins options before storing them for later usage:
//     - For class options and error instance options
//     - So that, if user mutates them, this does not change the options used
//       internally
//  - Most arguments passed to `plugin.*()` methods:
//     - This prevents mutations by plugins from impacting the logic
//     - This also allows exposing plugin methods arguments to users
//        - E.g. by returning them or setting them to `error.*`
//        - Without any risk for mutations to impact the logic
//           - E.g. shared `props` can be set and mutated on each error instance
//             without propagating to other instances
export const deepClone = (value) => {
  if (Array.isArray(value)) {
    return value.map(deepClone)
  }

  if (isPlainObj(value)) {
    return deepCloneObject(value)
  }

  return value
}

const deepCloneObject = (object) => {
  const copy = {}

  // eslint-disable-next-line fp/no-loops
  for (const key of Reflect.ownKeys(object)) {
    const descriptor = Object.getOwnPropertyDescriptor(object, key)
    const childCopy = deepClone(descriptor.value)
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(copy, key, { ...descriptor, value: childCopy })
  }

  return copy
}
