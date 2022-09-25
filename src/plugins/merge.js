import { excludeKeys } from 'filter-obj'
import isPlainObj from 'is-plain-obj'

// Merge:
//  - child class options with parent class options
//  - class options with instance options
//  - `AnyError` options with its `cause` options
// `undefined` values are ignored, even if the key is set because:
//  - This might be due to conditional logic
//  - Differentiating between `undefined` and "not defined" values is confusing
// Object options are shallowly merged.
export const mergePluginsOpts = function (oldOpts, newOpts, plugins) {
  return Object.fromEntries(
    plugins
      .map(getPluginName)
      .map((name) => getPluginOpts(oldOpts, newOpts, name))
      .filter(Boolean),
  )
}

const getPluginOpts = function (oldOpts, newOpts, name) {
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

// Only keep non-plugin options, such as the ones used by `custom` constructors
export const excludePluginsOpts = function (opts, plugins) {
  return excludeKeys(opts, plugins.map(getPluginName))
}

const getPluginName = function ({ name }) {
  return name
}
