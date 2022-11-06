import isPlainObj from 'is-plain-obj'

import { normalizeGetOptions } from '../../options/get.js'
import { normalizeIsOptions } from '../../options/method.js'

import { normalizeMethods } from './methods.js'
import { validatePluginName } from './name.js'

// Validate and normalize plugins
export const normalizePlugins = function (pluginOpts) {
  const plugins = pluginOpts.map(normalizePluginName)
  return plugins.map((plugin, index) => normalizePlugin(plugin, index, plugins))
}

const normalizePluginName = function (plugin) {
  if (!isPlainObj(plugin)) {
    throw new TypeError(
      `The "plugins" option must be an array of plugin objects: ${plugin}`,
    )
  }

  return validatePluginName(plugin)
}

const normalizePlugin = function (plugin, index, plugins) {
  validateRepeatedPlugin(plugin, index, plugins)
  validateOptionalFuncs(plugin)
  const pluginA = normalizeMethods({
    plugin,
    plugins,
    propName: 'instanceMethods',
    coreObject: Error.prototype,
    coreObjectName: 'error',
    forbiddenNames: new Set([]),
  })
  const pluginB = normalizeMethods({
    plugin: pluginA,
    plugins,
    propName: 'staticMethods',
    coreObject: Error,
    coreObjectName: 'Error',
    forbiddenNames: new Set(['normalize', 'subclass']),
  })
  const pluginC = normalizeIsOptions({ plugin: pluginB })
  const pluginD = normalizeGetOptions({ plugin: pluginC })
  return pluginD
}

const validateRepeatedPlugin = function (plugin, index, plugins) {
  const repeatsPlugin = plugins.some(
    (pluginA, indexA) => indexA !== index && pluginA.name === plugin.name,
  )

  if (repeatsPlugin) {
    throw new TypeError(
      `The plugin "${plugin.fullName}" must not be passed twice.`,
    )
  }
}

const validateOptionalFuncs = function (plugin) {
  OPTIONAL_FUNCS.forEach((funcName) => {
    validateOptionalMethod(plugin, funcName)
  })
}

const OPTIONAL_FUNCS = ['isOptions', 'getOptions', 'properties']

const validateOptionalMethod = function (plugin, funcName) {
  const funcValue = plugin[funcName]

  if (funcValue !== undefined && typeof funcValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${funcName}()" property must be either undefined or a function, not: ${funcValue}`,
    )
  }
}
