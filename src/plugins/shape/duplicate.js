// Ensure the same plugin is not passed twice.
// Also ensure two plugins do not define the same instanceMethods|staticMethods
export const validateDuplicatePlugins = function (
  parentPlugins,
  plugins,
  ParentError,
) {
  plugins.forEach((plugin) => {
    validateDuplicatePlugin(parentPlugins, plugin, ParentError)
  })
}

const validateDuplicatePlugin = function (parentPlugins, plugin, ParentError) {
  parentPlugins.forEach((parentPlugin) => {
    validateEachPlugin(parentPlugin, plugin, ParentError)
  })
}

const validateEachPlugin = function (parentPlugin, plugin, ParentError) {
  if (parentPlugin.name === plugin.name) {
    throw new TypeError(
      `${ParentError.name}.subclass() "plugins" option must not include "${plugin.fullName}": a parent error class already included that plugin.`,
    )
  }

  validateDuplicateMethods(parentPlugin, plugin, 'staticMethods')
  validateDuplicateMethods(parentPlugin, plugin, 'instanceMethods')
}

const validateDuplicateMethods = function (parentPlugin, plugin, propName) {
  Object.keys(plugin[propName]).forEach((methodName) => {
    validateDuplicateMethod({ parentPlugin, plugin, propName, methodName })
  })
}

const validateDuplicateMethod = function ({
  parentPlugin,
  plugin,
  propName,
  methodName,
}) {
  if (parentPlugin[propName][methodName] !== undefined) {
    throw new TypeError(
      `Both plugins "${plugin.fullName}" and "${parentPlugin.fullName}" must not define the same "${propName}.${methodName}" property.`,
    )
  }
}
