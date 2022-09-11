import isPlainObj from 'is-plain-obj'

// Merge:
//  - child class options with parent class options
//  - class options with instance options
//  - `AnyError` options with its `cause` options
// `undefined` values are ignored, even if the key is set because:
//  - This might be due to conditional logic
//  - Differentiating between `undefined` and "not defined" values is confusing
// Object options are shallowly merged.
export const mergePluginsOpts = function (childOpts, parentOpts, plugins) {
  return Object.fromEntries(
    plugins
      .map(({ name }) => getPluginOpts(childOpts, parentOpts, name))
      .filter(Boolean),
  )
}

const getPluginOpts = function (childOpts, parentOpts, name) {
  const pluginOpt = mergeOpt(childOpts[name], parentOpts[name])
  return pluginOpt === undefined ? undefined : [name, pluginOpt]
}

const mergeOpt = function (childOpt, parentOpt) {
  if (parentOpt === undefined) {
    return childOpt
  }

  if (isPlainObj(childOpt) && isPlainObj(parentOpt)) {
    return { ...childOpt, ...parentOpt }
  }

  return parentOpt
}
