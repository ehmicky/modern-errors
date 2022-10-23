import isPlainObj from 'is-plain-obj'

import { validatePluginsOptsNames } from '../plugins/shape/name.js'
import { deepClone } from '../utils/clone.js'

import { getPluginOpts } from './plugins.js'

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

  const globalOptsA = deepClone(globalOpts)
  validatePluginsOptsNames(globalOptsA, plugins)
  plugins.forEach((plugin) => {
    getPluginOpts({ pluginsOpts: globalOptsA, plugin, full: false })
  })
  return globalOptsA
}
