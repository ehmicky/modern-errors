import isPlainObj from 'is-plain-obj'

import { assignError } from './assign.js'
import { createErrorInfo } from './error_info.js'
import { getErrorPluginInfo } from './plugin_info.js'
import { getPreviousValues, getAllValues } from './previous.js'

// Set each `plugin.properties()`
export const setPluginsProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugins,
}) {
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
  const previousValues = getPreviousValues(newProps, error)
  assignError(error, newProps)
  return getAllValues(previousValues, error)
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
  const errorInfo = createErrorInfo({
    errorData,
    ErrorClasses,
    plugins,
    plugin,
  })
  const info = getErrorPluginInfo({ error, AnyError, ErrorClasses, errorInfo })
  const newProps = properties(info)

  if (!isPlainObj(newProps)) {
    throw new TypeError(
      `Plugin "${fullName}"'s "properties()" must return a plain object: ${newProps}`,
    )
  }

  return newProps
}
