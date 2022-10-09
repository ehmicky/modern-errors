import { mergeSpecificCause } from '../any/merge.js'

import { deepClone } from './clone.js'
import { mergeMethodOpts } from './method_opts.js'

// `options` is `undefined` unless `plugin.getOptions()` is defined
//  - This encourages using `plugin.getOptions()`
export const normalizeGetOptions = function ({
  plugin,
  plugin: {
    fullName,
    getOptions = defaultGetOptions.bind(undefined, fullName),
  },
}) {
  return { ...plugin, getOptions }
}

const defaultGetOptions = function (fullName, options) {
  if (options !== undefined) {
    throw new Error(
      `The plugin "${fullName}" does not have any options: ${options}`,
    )
  }
}

// Retrieve, validate and normalize all options for a given plugin.
// Those are passed to `plugin.properties|instanceMethods.*`.
// We pass whether the `options` object is partial or not using `full`:
//  - This allows validation|normalization that requires options to be full,
//    such as:
//     - Required properties
//     - Properties depending on others
//  - While still encouraging validation to be performed as early as possible
//     - As opposed to splitting `getOptions()` into two different methods,
//       since that might encourage using only the method with the full
//       `options` object, which would prevent any early validation
// We pass positional arguments to `plugin.isOptions()` and `getOptions()` as
// opposed to the object passed to other methods since:
//  - Those two methods are simpler and more functional
//  - This makes it clear that `options` is post-getOptions
// `getOptions()` is meant for error instance-agnostic logic:
//  - This is because it is called early when classes are being defined
//  - `info.*` is not available
//  - Error-specific logic should be inside other plugin methods instead
// Any validation|normalization specific to a method should be done inside that
// method, as opposed to inside `plugin.getOptions()`.
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
export const finalizePluginsOpts = function ({
  pluginsOpts,
  methodOpts,
  plugins,
  plugin,
}) {
  const pluginsOptsA = mergeMethodOpts(pluginsOpts, methodOpts, plugins)
  const pluginsOptsB = deepClone(pluginsOptsA)
  const options = getPluginOpts({
    pluginsOpts: pluginsOptsB,
    plugin,
    full: true,
  })
  return options
}

export const getPluginOpts = function ({
  pluginsOpts,
  plugin: { name, getOptions },
  full,
}) {
  try {
    return getOptions(pluginsOpts[name], full)
  } catch (cause) {
    throw mergeSpecificCause(new Error(`Invalid "${name}" options:`), cause)
  }
}
