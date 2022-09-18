import isPlainObj from 'is-plain-obj'

// Validate and normalize class options
export const validateClassesOpts = function (classesOpts) {
  if (classesOpts === undefined) {
    throw new TypeError('The first argument is required.')
  }

  if (!isPlainObj(classesOpts)) {
    throw new TypeError(
      `The first argument must be a plain object: ${classesOpts}`,
    )
  }

  validateClassNames(classesOpts)
}

// We enforce specifying `UnknownError` so that users:
//  - Export it
//  - Know they can configure it
const validateClassNames = function ({ UnknownError, GlobalAnyError }) {
  if (UnknownError === undefined) {
    throw new TypeError(`One of the error classes must be named "UnknownError".
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }

  if (GlobalAnyError !== undefined) {
    throw new TypeError(`Error class name must not be "GlobalAnyError".
It is reserved for some internal error class.`)
  }
}
