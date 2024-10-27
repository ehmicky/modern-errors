// Most error core properties are not enumerable
export const setNonEnumProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    value,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}
