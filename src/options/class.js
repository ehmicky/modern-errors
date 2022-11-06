import isPlainObj from 'is-plain-obj'

import { validatePluginsOptsNames } from '../plugins/shape/name.js'
import { deepClone } from '../utils/clone.js'

import { getPluginOpts } from './get.js'
import { mergePluginsOpts } from './merge.js'

// Validate and compute class options when `modernErrors()` is called so this
// throws at load time instead of at runtime.
// Merging priority is: global < parent class < child class < instance options.
export const getClassOpts = function (plugins, parentOpts, classOpts = {}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The second argument must be a plain object: ${classOpts}`,
    )
  }

  // eslint-disable-next-line no-unused-vars
  const { custom, ...classOptsA } = classOpts
  validatePluginsOptsNames(classOptsA, plugins)
  const classOptsB = mergePluginsOpts(parentOpts, classOptsA, plugins)
  const classOptsC = deepClone(classOptsB)
  plugins.forEach((plugin) => {
    getPluginOpts({ pluginsOpts: classOptsC, plugin, full: false })
  })
  return classOptsC
}
