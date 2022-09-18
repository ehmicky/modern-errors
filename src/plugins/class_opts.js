import isPlainObj from 'is-plain-obj'

import { mergePluginsOpts } from './merge.js'
import { normalizePluginOpts } from './normalize.js'

// The second argument to `modernErrors()` are global options applied to all
// classes.
// Those are validated right away, before merging to class options, since they
// are used on their own by plugins static methods.
// This is not redundant with sharing options with `ErrorClass.subclass()`
// because this:
//   - Is simpler and more convenient
//   - Applies to `AnyError.*` static methods
//      - It should conceptually (and for typing purpose) be declared before
//        `AnyError` is created
//   - Encourages plugins to use global options
//      - As opposed to alternatives:
//         - Using functions that take options as argument and return a plugin
//         - Passing options as arguments to instance|static methods
//      - To ensure:
//         - A consistent, single way of configuring plugins
//         - Options can be specified at different levels
export const getGlobalOpts = function (plugins, globalOpts = {}) {
  if (!isPlainObj(globalOpts)) {
    throw new TypeError(
      `The second argument must be a plain object: ${globalOpts}`,
    )
  }

  if (globalOpts.custom !== undefined) {
    throw new TypeError(
      'Error option "custom" must be passed to "AnyError.subclass()", not to "modernErrors()".',
    )
  }

  plugins.forEach((plugin) => {
    normalizePluginOpts(globalOpts, plugin)
  })
  return globalOpts
}

// Validate and compute class options when `modernErrors()` is called so this
// throws at load time instead of at runtime.
// Merging priority is: global < class < instance options.
export const getClassOpts = function (plugins, globalOpts, classOpts = {}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The second argument must be a plain object: ${globalOpts}`,
    )
  }

  const { custom, ...classOptsA } = classOpts
  const classOptsB = mergePluginsOpts(globalOpts, classOptsA, plugins)
  plugins.forEach((plugin) => {
    normalizePluginOpts(classOptsB, plugin)
  })
  return { custom, classOpts: classOptsB }
}
