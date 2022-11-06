// Merge plugins of parent and child classes
export const mergePluginOpts = function (parentPluginsOpt, pluginsOpt = []) {
  if (!Array.isArray(pluginsOpt)) {
    throw new TypeError(`The "plugins" option must be an array: ${pluginsOpt}`)
  }

  return [...parentPluginsOpt, ...pluginsOpt]
}
