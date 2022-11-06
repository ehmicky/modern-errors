import isPlainObj from 'is-plain-obj'

import { validatePluginsOptsNames } from '../plugins/shape/name.js'

import { deepClone } from './clone.js'
import { getPluginOpts } from './get.js'
import { mergePluginsOpts } from './merge.js'

// Simple validation and normalization of class options
export const normalizeClassOpts = function (ParentError, classOpts = {}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The second argument of "${ParentError.name}.subclass()" must be a plain object, not: ${classOpts}`,
    )
  }

  return classOpts
}

// Validate and compute class options as soon as the class is created.
// Merging priority is: parent class < child class < instance options.
// We encourages plugins to use class options
//  - Including global ones, i.e. on the top-level class
//  - As opposed to alternatives:
//     - Using functions that take options as argument and return a plugin
//     - Passing options as arguments to instance|static methods
//  - To ensure:
//     - A consistent, single way of configuring plugins
//     - Options can be specified at different levels
export const getClassOpts = function (parentOpts, classOpts, plugins) {
  validatePluginsOptsNames(classOpts, plugins)
  const classOptsA = mergePluginsOpts(parentOpts, classOpts, plugins)
  const classOptsB = deepClone(classOptsA)
  plugins.forEach((plugin) => {
    getPluginOpts({ pluginsOpts: classOptsB, plugin, full: false })
  })
  return classOptsB
}
