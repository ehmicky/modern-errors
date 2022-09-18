// Validate error class name
export const validateClassName = function (className, ErrorClasses) {
  if (ErrorClasses[className] !== undefined) {
    throw new TypeError(`Error class "${className}" has already been defined.`)
  }

  if (className === 'AnyError') {
    throw new TypeError(`Error class name must not be "AnyError".
It is reserved for the base error class.`)
  }
}
