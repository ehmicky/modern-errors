import isPlainObj from 'is-plain-obj'

import { validatePluginsOptsNames } from '../plugins/shape/name.js'
import { deepClone } from '../utils/clone.js'

import { getPluginOpts } from './get.js'
import { mergePluginsOpts } from './merge.js'

// Validate and compute class options when `modernErrors()` is called so this
// throws at load time instead of at runtime.
// Merging priority is: global < parent class < child class < instance options.
export const getClassOpts = function ({
  plugins,
  parentOpts,
  className,
  classOpts = {},
}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The second argument must be a plain object: ${classOpts}`,
    )
  }

  const { custom, ...classOptsA } = classOpts
  validateCustomUnknown(custom, className)
  validatePluginsOptsNames(classOptsA, plugins)
  const classOptsB = mergePluginsOpts(parentOpts, classOptsA, plugins)
  const classOptsC = deepClone(classOptsB)
  plugins.forEach((plugin) => {
    getPluginOpts({
      pluginsOpts: classOptsC,
      plugin,
      full: getClassOptsFull(className, plugin),
    })
  })
  return { custom, classOpts: classOptsC }
}

// `UnknownError` are usually instantiated internally with no options passed to
// its constructor. I.e. if `plugin.properties()` is defined, the `options`
// object can already be considered `full`.
const getClassOptsFull = function (className, { properties }) {
  return className === 'UnknownError' && properties !== undefined
}

// UnknownError cannot have a `custom` class:
//  - This ensures its constructor does not throw
//  - This discourages instantiating UnknownError directly, encouraging creating
//    a separate error class for known system errors instead
//  - This prevents `custom` instance properties, or properties set in the
//    constructor, since those would be kept, even if the `UnknownError` is
//    only used temporarily as part of `AnyError.normalize()`
// We discourage extending or instantiating UnknownError but do not forbid it
// since:
//  - Users might not know instantiating would throw until runtime, which is
//    problematic in error handling logic
//  - There could be some potential use cases, e.g. if a branch is never meant
//    to happen unless some unknown bug happened
const validateCustomUnknown = function (custom, className) {
  if (custom !== undefined && className === 'UnknownError') {
    throw new TypeError(
      `Error option "custom" cannot be used with "UnknownError".
However, it can be used with its subclasses.

  export const ChildUnknownError = UnknownError.subclass("ChildUnknownError", {
    custom: class extends UnknownError {
      // ...
    }
  })`,
    )
  }
}
