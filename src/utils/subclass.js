// Check if `ErrorClass` is a subclass of `ParentClass`
export const isSubclass = function (ErrorClass, ParentClass) {
  return ParentClass === ErrorClass || isProtoOf.call(ParentClass, ErrorClass)
}

const { isPrototypeOf: isProtoOf } = Object.prototype
