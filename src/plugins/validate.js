import isPlainObj from 'is-plain-obj'

// Validate plugins
export const validatePlugins = function (plugins) {
  if (!Array.isArray(plugins)) {
    throw new TypeError(`The second argument must be an array: ${plugins}`)
  }

  plugins.forEach(validatePlugin)
}

const validatePlugin = function (plugin) {
  if (!isPlainObj(plugin)) {
    throw new TypeError(
      `The second argument must be an array of plugin objects: ${plugin}`,
    )
  }

  validatePluginName(plugin)
  validateOptionalFuncs(plugin)
  validateMethods(plugin, 'instanceMethods')
  validateMethods(plugin, 'staticMethods')
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

const validateMethods = function (plugin, propName) {
  if (plugin[propName] === undefined) {
    return
  }

  if (!isPlainObj(plugin[propName])) {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "${propName}" property must be either undefined or a plain object, not: ${plugin[propName]}`,
    )
  }

  Object.entries(plugin[propName]).forEach(
    validateMethod.bind(undefined, plugin, propName),
  )
}

const validateMethod = function (plugin, propName, [methodName, methodValue]) {
  if (typeof methodValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.name}"'s "${propName}.${methodName}" property must be a function, not: ${plugin[propName]}`,
    )
  }
}
