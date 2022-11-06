import isPlainObj from 'is-plain-obj'

import { validatePluginsOptsNames } from '../plugins/shape/name.js'
import { deepClone } from '../utils/clone.js'

import { getPluginOpts } from './get.js'
import { mergePluginsOpts } from './merge.js'

// Global options are AnyError's class options.
// This encourages plugins to use global options
//  - As opposed to alternatives:
//     - Using functions that take options as argument and return a plugin
//     - Passing options as arguments to instance|static methods
//  - To ensure:
//     - A consistent, single way of configuring plugins
//     - Options can be specified at different levels
export const validateGlobalOpts = function (globalOpts) {
  if (globalOpts?.custom !== undefined) {
    throw new TypeError(
      'Error option "custom" must be passed to "ErrorClass.subclass()", not to "modernErrors()".',
    )
  }
}

// Simple validation and normalization of class options
export const normalizeClassOpts = function (classOpts = {}) {
  if (!isPlainObj(classOpts)) {
    throw new TypeError(
      `The second argument of "ErrorClass.subclass()" must be a plain object, not: ${classOpts}`,
    )
  }

  return classOpts
}

// Validate and compute class options as soon as the class is created.
// Merging priority is: parent class < child class < instance options.
export const getClassOpts = function (parentOpts, classOpts, plugins) {
  validatePluginsOptsNames(classOpts, plugins)
  const classOptsA = mergePluginsOpts(parentOpts, classOpts, plugins)
  const classOptsB = deepClone(classOptsA)
  plugins.forEach((plugin) => {
    getPluginOpts({ pluginsOpts: classOptsB, plugin, full: false })
  })
  return classOptsB
}
