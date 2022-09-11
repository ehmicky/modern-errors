// Retrieve, validate and normalize all options for a given plugin.
// Those are passed to `plugin.set|unset|instanceMethods.*`.
// Plugins should avoid:
//  - Letting options be optionally a function: class constructors can be used
//    for this, by manipulating `options` and passing it to `super()`
//  - Using non-JSON serializable options, unless unavoidable
// Plugin options correspond to their `name`:
//  - It should match the package name
//  - This convention is simple to understand
//  - This promotes a single option name per plugin, which reduces the potential
//    for name conflict
//  - This reduces cross-plugin dependencies since they cannot easily reference
//    each other, keeping them decoupled from each other
export const getErrorOpts = function (error, errorData, plugin) {
  const { pluginsOpts } = errorData.get(error)
  return normalizePluginOpts(pluginsOpts, plugin)
}

export const normalizePluginOpts = function (pluginsOpts, { name, normalize }) {
  const pluginOpts = pluginsOpts[name]
  return normalize === undefined
    ? pluginOpts
    : normalize({ options: pluginOpts })
}
