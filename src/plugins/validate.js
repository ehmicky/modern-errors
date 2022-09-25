import isPlainObj from 'is-plain-obj'

import { defaultIsOptions } from './method_opts.js'
import { validatePluginName } from './name.js'
import { normalizeNormalize } from './normalize.js'

// Validate and normalize plugins
export const normalizePlugins = function (plugins = []) {
  if (!Array.isArray(plugins)) {
    throw new TypeError(`The first argument must be an array: ${plugins}`)
  }

  return plugins.map(normalizePlugin)
}

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
  const pluginD = normalizeIsOptions(pluginC)
  const pluginE = normalizeNormalize(pluginD)
  return pluginE
}

const validateOptionalFuncs = function (plugin) {
  OPTIONAL_FUNCS.forEach((funcName) => {
    validateOptionalMethod(plugin, funcName)
  })
  validateUnsetWithoutSet(plugin)
  validateSetWithoutUnset(plugin)
}

const OPTIONAL_FUNCS = ['isOptions', 'normalize', 'unset', 'set']

const validateOptionalMethod = function (plugin, funcName) {
  const funcValue = plugin[funcName]

  if (funcValue !== undefined && typeof funcValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${funcName}()" property must be either undefined or a function, not: ${funcValue}`,
    )
  }
}

const validateUnsetWithoutSet = function (plugin) {
  if (plugin.set === undefined && plugin.unset !== undefined) {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "set()" function must defined when "unset()" is defined`,
    )
  }
}

const validateSetWithoutUnset = function (plugin) {
  if (plugin.set !== undefined && plugin.unset === undefined) {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "unset()" function must defined when "set()" is defined`,
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

const normalizeIsOptions = function ({
  isOptions = defaultIsOptions,
  ...plugin
}) {
  if (typeof isOptions({}) !== 'boolean') {
    throw new TypeError(
      `The plugin "${
        plugin.fullName
      }"'s "isOptions()" method must return a boolean, not: ${typeof isOptions(
        {},
      )}`,
    )
  }

  return { ...plugin, isOptions }
}
