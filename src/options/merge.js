import isPlainObj from 'is-plain-obj'

// Merge:
//  - child class options with parent class options
//  - class options with instance options
//  - method options with other options
// The same logic is used between those, for consistency.
// For class options, this is done as late as possible to ensure `instancesData`
// only contains instance options.
// `undefined` values are ignored, even if the key is set because:
//  - This might be due to conditional logic
//  - Differentiating between `undefined` and "not defined" values is confusing
// Object options are shallowly merged.
// The merging logic enforces the idea that information should only be appended,
// to ensure that no error information is lost
//  - E.g. there is no direct way to unset options
//     - However, this can be achieved, e.g. by moving parent class options
//       to their subclasses
export const mergePluginsOpts = (oldOpts, newOpts, plugins) =>
  Object.fromEntries(
    getPluginNames(plugins)
      .map((name) => mergePluginOpts(oldOpts, newOpts, name))
      .filter(Boolean),
  )

const mergePluginOpts = (oldOpts, newOpts, name) => {
  const pluginOpt = mergeOpt(oldOpts[name], newOpts[name])
  return pluginOpt === undefined ? undefined : [name, pluginOpt]
}

const mergeOpt = (oldOpt, newOpt) => {
  if (newOpt === undefined) {
    return oldOpt
  }

  if (isPlainObj(oldOpt) && isPlainObj(newOpt)) {
    return { ...oldOpt, ...newOpt }
  }

  return newOpt
}

export const getPluginNames = (plugins) => plugins.map(getPluginName)

const getPluginName = ({ name }) => name
