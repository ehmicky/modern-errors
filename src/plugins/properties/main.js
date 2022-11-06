import isPlainObj from 'is-plain-obj'

import { getErrorPluginInfo } from '../info/main.js'

import { assignError } from './assign.js'

// Set each `plugin.properties()`.
// A `reduce()` function is used so that plugins can override the same
// properties, e.g. `message` or `stack`.
export const setPluginsProperties = function ({
  error,
  ErrorClasses,
  errorData,
  plugins,
}) {
  return plugins.forEach((plugin) => {
    applyPluginProperties({ error, ErrorClasses, errorData, plugin, plugins })
  })
}

const applyPluginProperties = function ({
  error,
  ErrorClasses,
  errorData,
  plugin,
  plugin: { properties, fullName },
  plugins,
}) {
  if (properties === undefined) {
    return
  }

  const info = getErrorPluginInfo({
    error,
    errorData,
    ErrorClasses,
    plugins,
    plugin,
  })
  const newProps = properties(info)

  if (!isPlainObj(newProps)) {
    throw new TypeError(
      `Plugin "${fullName}"'s "properties()" must return a plain object: ${newProps}`,
    )
  }

  assignError(error, newProps, plugins)
}
