import isPlainObj from 'is-plain-obj'

import { assignError } from './assign.js'
import { getPluginInfo } from './info.js'
import { mergeClassOpts } from './merge.js'
import { getPreviousValues, getAllValues } from './previous.js'

// Set each `plugin.properties()`
export const setPluginsProperties = function ({
  error,
  AnyError,
  ErrorClasses,
  unknownDeep,
  errorData,
  plugins,
}) {
  const allNewProps = plugins.filter(pluginHasProperties).map((plugin) =>
    getPluginProperties({
      error,
      AnyError,
      ErrorClasses,
      unknownDeep,
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
  unknownDeep,
  errorData,
  plugin,
  plugin: { properties, fullName },
  plugins,
}) {
  const { pluginsOpts } = errorData.get(error)
  const pluginsOptsA = mergeClassOpts({
    error,
    ErrorClasses,
    plugins,
    pluginsOpts,
  })
  const info = getPluginInfo({
    pluginsOpts: pluginsOptsA,
    plugin,
    AnyError,
    ErrorClasses,
  })
  const newProps = properties({ ...info, error, unknownDeep })

  if (!isPlainObj(newProps)) {
    throw new TypeError(
      `Plugin "${fullName}"'s "properties()" must return a plain object: ${newProps}`,
    )
  }

  return newProps
}
