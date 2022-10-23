import isPlainObj from 'is-plain-obj'

import { assignError } from './assign.js'
import { getErrorPluginInfo } from './plugin_info.js'
import { getAllValues } from './previous.js'

// Set each `plugin.properties()`
export const setPluginsProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugins,
}) {
  const previousDescriptors = Object.getOwnPropertyDescriptors(error)
  const allNewProps = plugins.filter(pluginHasProperties).map((plugin) =>
    getPluginProperties({
      error,
      AnyError,
      ErrorClasses,
      errorData,
      plugin,
      plugins,
    }),
  )
  const newProps = Object.assign({}, ...allNewProps)
  assignError(error, newProps, plugins)
  const newDescriptors = Object.getOwnPropertyDescriptors(error)
  return getAllValues(previousDescriptors, newDescriptors)
}

const pluginHasProperties = function ({ properties }) {
  return properties !== undefined
}

const getPluginProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugin,
  plugin: { properties, fullName },
  plugins,
}) {
  const info = getErrorPluginInfo({
    error,
    errorData,
    AnyError,
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

  return newProps
}
