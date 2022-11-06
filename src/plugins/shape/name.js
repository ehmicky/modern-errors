// Ensure global and class options:
//  - Only contain plugins options
//  - Do not refer to unloaded plugins
export const validatePluginsOptsNames = function (pluginsOpts, plugins) {
  Object.entries(pluginsOpts).forEach(([optName, pluginOpts]) => {
    validatePluginOptsName(optName, pluginOpts, plugins)
  })
}

const validatePluginOptsName = function (optName, pluginOpts, plugins) {
  if (!plugins.some(({ name }) => name === optName)) {
    throw new TypeError(
      `Invalid option "${optName}": the plugin "${NAME_PREFIX}${optName}" must be passed to ErrorClass.subclass("...", { plugins })`,
    )
  }
}

// Validate `plugin.name`
export const validatePluginName = function (plugin) {
  if (plugin.name === undefined) {
    throw new TypeError(`The plugin is missing a "name": ${plugin}`)
  }

  const { name } = plugin

  if (typeof name !== 'string') {
    throw new TypeError(`The plugin "name" must be a string: ${name}`)
  }

  validateNameString(name)

  return { ...plugin, fullName: `${NAME_PREFIX}${name}` }
}

const validateNameString = function (name) {
  if (FORBIDDEN_NAMES.has(name)) {
    throw new TypeError(
      `The plugin "name" must not be the following reserved word: ${name}`,
    )
  }

  if (!NAME_REGEXP.test(name)) {
    throw new TypeError(
      `The plugin "name" must only contain lowercase letters and digits: ${name}`,
    )
  }
}

const FORBIDDEN_NAMES = new Set([
  'cause',
  'errors',
  'custom',
  'wrap',
  'constructorArgs',
])
const NAME_REGEXP = /^[a-z][a-z\d]*$/u

// Plugin package names should start with this prefix, but not `plugin.name`
const NAME_PREFIX = 'modern-errors-'
