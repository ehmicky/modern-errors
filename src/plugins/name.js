// Validate `plugin.name`
export const validatePluginName = function (plugin) {
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

  return { ...plugin, fullName: `${NAME_PREFIX}${name}` }
}

const NAME_REGEXP = /^[a-z][a-z\d]*$/u

// Plugin package names should start with this prefix, but not `plugin.name`
const NAME_PREFIX = 'modern-errors-'
