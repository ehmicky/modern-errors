// We use a global `WeakMap` to store class-specific information (such as
// options) instead of storing it as a symbol property on each error class to
// ensure:
//  - This is not exposed to users or plugin authors
//  - This does not change how the error class is printed
// We use a `WeakMap` instead of an object since the key should be the error
// class, not its `name`, because classes might have duplicate names.
export const classesData = new WeakMap()

// The same but for error instances
export const instancesData = new WeakMap()
