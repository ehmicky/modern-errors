import isPlainObj from 'is-plain-obj'

import PROPS_PLUGIN from '../core_plugins/props.js'

import { normalizeGetOptions } from './get.js'
import { normalizeIsOptions } from './method_opts.js'
import { validatePluginName } from './name.js'

// Validate and normalize plugins
export const normalizePlugins = function (plugins = []) {
  if (!Array.isArray(plugins)) {
    throw new TypeError(`The first argument must be an array: ${plugins}`)
  }

  return [...CORE_PLUGINS, ...plugins].map(normalizePlugin)
}

// Plugins included by default.
// Order is significant, since last plugins `properties()` have priority.
const CORE_PLUGINS = [PROPS_PLUGIN]

const normalizePlugin = function (plugin) {
  if (!isPlainObj(plugin)) {
    throw new TypeError(
      `The first argument must be an array of plugin objects: ${plugin}`,
    )
  }

  const pluginA = validatePluginName(plugin)
  validateOptionalFuncs(pluginA)
  const pluginB = normalizeMethods(pluginA, 'instanceMethods')
  const pluginC = normalizeMethods(pluginB, 'staticMethods')
  const pluginD = normalizeIsOptions({ plugin: pluginC })
  const pluginE = normalizeGetOptions({ plugin: pluginD })
  return pluginE
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

const normalizeMethods = function (plugin, propName) {
  const methods = plugin[propName] ?? {}

  if (!isPlainObj(methods)) {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${propName}" property must be either undefined or a plain object, not: ${methods}`,
    )
  }

  Object.entries(methods).forEach(([methodName, methodValue]) => {
    validateMethod(methodValue, `${propName}.${methodName}`, plugin)
  })
  return { ...plugin, [propName]: methods }
}

const validateMethod = function (methodValue, methodName, plugin) {
  if (typeof methodValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${methodName}" property must be a function, not: ${methodValue}`,
    )
  }
}
