// `options` is `undefined` unless `plugin.normalize()` is defined
//  - This encourages using `plugin.normalize()`
export const normalizeNormalize = function (plugin) {
  return {
    ...plugin,
    normalize:
      plugin.normalize ?? defaultNormalize.bind(undefined, plugin.name),
  }
}

const defaultNormalize = function (name, { options }) {
  if (options !== undefined) {
    throw new Error(`The plugin "${name}" does not have any option: ${options}`)
  }
}

// Retrieve, validate and normalize all options for a given plugin.
// Those are passed to `plugin.set|unset|instanceMethods.*`.
// We also pass all plugins options, before normalization, to
// `plugin.set|unset|instanceMethods.*`
//  - This is mostly meant for plugins like serialization which need to
//    re-instantiate or clone errors
// We pass whether the `options` object is partial or not using `full`:
//  - This allows validation|normalization that requires options to be full,
//    such as:
//     - Required properties
//     - Properties depending on others
//  - While still encouraging validation to be performed as early as possible
//     - As opposed to splitting `normalize()` into two different methods, since
//       that might encourage using only the method with the full `options`
//       object, which would prevent any early validation
// Any validation|normalization specific to a method should be done inside that
// method, as opposed to inside `plugin.normalize()`
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
export const normalizePluginOpts = function (
  pluginsOpts,
  { name, normalize },
  full,
) {
  return normalize({ options: pluginsOpts[name], full })
}
