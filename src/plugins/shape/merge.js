// Merge plugins of parent and child classes
export const mergePluginOpts = function (
  { plugins: parentPluginsOpt },
  { plugins: childPluginsOpt = [] },
) {
  if (!Array.isArray(childPluginsOpt)) {
    throw new TypeError(
      `The "plugins" option must be an array: ${childPluginsOpt}`,
    )
  }

  return [...parentPluginsOpt, ...childPluginsOpt]
}
