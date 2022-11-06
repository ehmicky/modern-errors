// We use a global `WeakMap` to store class-specific information (such as
// options) instead of storing it as a symbol property on each error class,
// to ensure this is not exposed to users.
// We use a `WeakMap` instead of an object since the key should be the error
// class, not its `name`, because classes might have duplicate names.
export const ERROR_CLASSES = new WeakMap()
