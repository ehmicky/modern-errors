import isPlainObj from 'is-plain-obj'

import { normalizeGetOptions } from '../../options/get.js'
import { normalizeIsOptions } from '../../options/method.js'

import { validateDuplicatePlugins, validateSameMethods } from './duplicate.js'
import { normalizeAllMethods } from './methods.js'
import { validatePluginName } from './name.js'

// Validate and normalize plugins.
// Also merge plugins of parent and child classes.
export const normalizePlugins = function (parentPlugins, plugins, ParentError) {
  const pluginsA = normalizePluginsOpt(ParentError, plugins)
  const pluginsB = pluginsA.map((plugin) =>
    normalizePlugin(plugin, ParentError),
  )
  const pluginsC = [...parentPlugins, ...pluginsB]
  validateDuplicatePlugins(pluginsC, ParentError)
  return pluginsC
}

const normalizePluginsOpt = function (ParentError, plugins = []) {
  if (!Array.isArray(plugins)) {
    throw new TypeError(
      `The "plugins" option of "${ParentError.name}.subclass()" must be an array: ${plugins}`,
    )
  }

  return plugins
}

const normalizePlugin = function (plugin, ParentError) {
  if (!isPlainObj(plugin)) {
    throw new TypeError(
      `The "plugins" option of "${ParentError.name}.subclass()" must be an array of plugin objects: ${plugin}`,
    )
  }

  const pluginA = validatePluginName(plugin)
  validateOptionalFuncs(pluginA)
  const pluginB = normalizeAllMethods(pluginA)
  validateSameMethods(pluginB)
  const pluginC = normalizeIsOptions({ plugin: pluginB })
  const pluginD = normalizeGetOptions({ plugin: pluginC })
  return pluginD
}

const validateOptionalFuncs = function (plugin) {
  OPTIONAL_FUNCS.forEach((funcName) => {
    validateOptionalFunc(plugin, funcName)
  })
}

const OPTIONAL_FUNCS = ['isOptions', 'getOptions', 'properties']

const validateOptionalFunc = function (plugin, funcName) {
  const funcValue = plugin[funcName]

  if (funcValue !== undefined && typeof funcValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${funcName}()" property must be either undefined or a function, not: ${funcValue}`,
    )
  }
}
