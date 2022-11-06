import isPlainObj from 'is-plain-obj'

import { ERROR_CLASSES } from '../subclass/map.js'

// Merge global and class options with instance options.
// This is done as late as possible to ensure `errorData` only contains instance
// options, since `constructorArgs` should not have global nor class options.
export const mergeClassOpts = function (ErrorClass, plugins, pluginsOpts) {
  const { classOpts } = ERROR_CLASSES.get(ErrorClass)
  return mergePluginsOpts(classOpts, pluginsOpts, plugins)
}

// Merge:
//  - child class options with parent class options (including global ones)
//  - class options with instance options
//  - method options with other options
// The same logic is used between those, for consistency.
// `undefined` values are ignored, even if the key is set because:
//  - This might be due to conditional logic
//  - Differentiating between `undefined` and "not defined" values is confusing
// Object options are shallowly merged.
// The merging logic enforces the idea that information should only be appended,
// to ensure that no error information is lost
//  - E.g. there is no direct way to unset options
//     - However, this can be achieved, e.g. by moving parent class options
//       to their subclasses
export const mergePluginsOpts = function (oldOpts, newOpts, plugins) {
  return Object.fromEntries(
    getPluginNames(plugins)
      .map((name) => mergePluginOpts(oldOpts, newOpts, name))
      .filter(Boolean),
  )
}

const mergePluginOpts = function (oldOpts, newOpts, name) {
  const pluginOpt = mergeOpt(oldOpts[name], newOpts[name])
  return pluginOpt === undefined ? undefined : [name, pluginOpt]
}

const mergeOpt = function (oldOpt, newOpt) {
  if (newOpt === undefined) {
    return oldOpt
  }

  if (isPlainObj(oldOpt) && isPlainObj(newOpt)) {
    return { ...oldOpt, ...newOpt }
  }

  return newOpt
}

export const getPluginNames = function (plugins) {
  return plugins.map(getPluginName)
}

const getPluginName = function ({ name }) {
  return name
}
