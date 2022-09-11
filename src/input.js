import isPlainObj from 'is-plain-obj'

import { getGlobalOpts } from './plugins/class_opts.js'
import { validatePlugins } from './plugins/validate.js'

// Validate and normalize arguments
export const normalizeInput = function (classesOpts, plugins = []) {
  validatePlugins(plugins)
  validateClassesOpts(classesOpts)
  const { globalOpts, classesOpts: classesOptsA } = getGlobalOpts(
    classesOpts,
    plugins,
  )
  return { classesOpts: classesOptsA, globalOpts, plugins }
}

const validateClassesOpts = function (classesOpts) {
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
const validateClassNames = function ({ UnknownError, BaseError }) {
  if (UnknownError === undefined) {
    throw new TypeError(`One of the error classes must be named "UnknownError".
"UnknownError" is assigned by "AnyError.normalize()" to exceptions with an unknown class.`)
  }

  if (BaseError !== undefined) {
    throw new TypeError(`Error class name must not be "BaseError".
It is reserved for some internal error class.`)
  }
}
