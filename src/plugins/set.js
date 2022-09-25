import isPlainObj from 'is-plain-obj'

import { assignError } from './assign.js'
import { getPluginInfo } from './info.js'
import { mergeClassOpts } from './merge.js'
import { getPreviousValues, filterPreviousValues } from './previous.js'

// Apply each `plugin.set()`
export const applyPluginsSet = function ({
  error,
  AnyError,
  ErrorClasses,
  plugins,
  pluginsOpts,
}) {
  const allNewProps = plugins.filter(pluginHasSet).map((plugin) =>
    callPluginSet({
      error,
      AnyError,
      ErrorClasses,
      plugin,
      plugins,
      pluginsOpts,
    }),
  )
  const newProps = Object.assign({}, ...allNewProps)
  const previousValues = getPreviousValues(newProps, error)
  assignError(error, newProps)
  return filterPreviousValues(previousValues, error)
}

const pluginHasSet = function ({ set }) {
  return set !== undefined
}

const callPluginSet = function ({
  error,
  AnyError,
  ErrorClasses,
  plugin,
  plugin: { set, fullName },
  plugins,
  pluginsOpts,
}) {
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
  const newProps = set({ ...info, error })

  if (!isPlainObj(newProps)) {
    throw new TypeError(
      `Plugin "${fullName}"'s "set()" must return a plain object: ${newProps}`,
    )
  }

  return newProps
}
