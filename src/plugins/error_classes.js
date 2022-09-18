// `ErrorClasses` are passed to all plugin methods.
// A shallow copy is done to prevent mutations.
export const getErrorClasses = function (ErrorClasses) {
  return Object.fromEntries(Object.entries(ErrorClasses).map(getErrorClass))
}

const getErrorClass = function ([className, { ErrorClass }]) {
  return [className, ErrorClass]
}
