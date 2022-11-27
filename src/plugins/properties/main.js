import isPlainObj from 'is-plain-obj'

import { getErrorPluginInfo } from '../info/main.js'

import { assignError } from './assign/main.js'

// Set each `plugin.properties()`.
// A `reduce()` function is used so that plugins can override the same
// properties, e.g. `message` or `stack`.
// Since `plugin.properties()` is called at error initialization time and might
// be called later again with newly merged options, plugins should try to
// make that later call behave as if the first did not happen.
//  - If `options` are not an object, this means calling `properties(optionsA)`
//    then `properties(optionsB)` should be the same as just calling
//    `properties(optionsB)`
//  - If `options` are an object, the same applies but with
//    `{ ...optionsA, ...optionsB }`
export const setPluginsProperties = function (error, plugins) {
  return plugins.forEach((plugin) => {
    applyPluginProperties({ error, plugin, plugins })
  })
}

const applyPluginProperties = function ({
  error,
  plugin,
  plugin: { properties, fullName },
  plugins,
}) {
  if (properties === undefined) {
    return
  }

  const info = getErrorPluginInfo({ error, plugins, plugin })
  const newProps = properties(info)

  if (!isPlainObj(newProps)) {
    throw new TypeError(
      `Plugin "${fullName}"'s "properties()" must return a plain object: ${newProps}`,
    )
  }

  assignError(error, newProps, plugins)
}
