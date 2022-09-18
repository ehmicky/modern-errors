import isPlainObj from 'is-plain-obj'

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

  validatePluginName(plugin)
  validateOptionalFuncs(plugin)
  const pluginA = normalizeMethods(plugin, 'instanceMethods')
  const pluginB = normalizeMethods(pluginA, 'staticMethods')
  return pluginB
}

const validatePluginName = function (plugin) {
  if (plugin.name === undefined) {
    throw new TypeError(`The plugin is missing a "name": ${plugin}`)
  }

  const { name } = plugin

  if (typeof name !== 'string') {
    throw new TypeError(`The plugin "name" must be a string: ${name}`)
  }

  if (!NAME_REGEXP.test(name)) {
    throw new TypeError(
      `The plugin "name" must only contain lowercase letters and digits: ${name}`,
    )
  }
}

const NAME_REGEXP = /^[a-z][a-z\d]*$/u

const validateOptionalFuncs = function (plugin) {
  OPTIONAL_FUNCS.forEach((funcName) => {
    validateOptionalMethod(plugin, funcName)
  })
  validateUnsetWithoutSet(plugin)
  validateSetWithoutUnset(plugin)
}

const OPTIONAL_FUNCS = ['normalize', 'unset', 'set']

const validateOptionalMethod = function (plugin, funcName) {
  const funcValue = plugin[funcName]

  if (funcValue !== undefined && typeof funcValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "${funcName}()" property must be either undefined or a function, not: ${funcValue}`,
    )
  }
}

const validateUnsetWithoutSet = function (plugin) {
  if (plugin.set === undefined && plugin.unset !== undefined) {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "set()" function must defined when "unset()" is defined`,
    )
  }
}

const validateSetWithoutUnset = function (plugin) {
  if (plugin.set !== undefined && plugin.unset === undefined) {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "unset()" function must defined when "set()" is defined`,
    )
  }
}

const normalizeMethods = function (plugin, propName) {
  const methods = plugin[propName] ?? {}

  if (!isPlainObj(methods)) {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "${propName}" property must be either undefined or a plain object, not: ${methods}`,
    )
  }

  Object.entries(methods).forEach(
    validateMethod.bind(undefined, plugin, propName),
  )
  return { ...plugin, [propName]: methods }
}

const validateMethod = function (plugin, propName, [methodName, methodValue]) {
  if (typeof methodValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "${propName}.${methodName}" property must be a function, not: ${plugin[propName]}`,
    )
  }
}
