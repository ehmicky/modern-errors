import isPlainObj from 'is-plain-obj'

import { getErrorPluginInfo } from '../info/main.js'

import { assignError } from './assign.js'
import { getAllValues } from './previous.js'

// Set each `plugin.properties()`.
// A `reduce()` function is used so that plugins can override the same
// properties, e.g. `message` or `stack`.
export const setPluginsProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugins,
}) {
  const previousDescriptors = Object.getOwnPropertyDescriptors(error)
  const errorA = applyPluginsProperties({
    error,
    AnyError,
    ErrorClasses,
    errorData,
    plugins,
  })
  const newDescriptors = Object.getOwnPropertyDescriptors(errorA)
  return getAllValues(previousDescriptors, newDescriptors)
}

const applyPluginsProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugins,
}) {
  return plugins.reduce(
    (errorA, plugin) =>
      applyPluginProperties({
        error: errorA,
        AnyError,
        ErrorClasses,
        errorData,
        plugin,
        plugins,
      }),
    error,
  )
}

const applyPluginProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  errorData,
  plugin,
  plugin: { properties, fullName },
  plugins,
}) {
  if (properties === undefined) {
    return error
  }

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

  assignError(error, newProps, plugins)
  return error
}
