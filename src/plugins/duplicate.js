// Plugins must not override each other
export const validateDuplicatePlugin = function ({
  methodName,
  plugin,
  plugins,
  propName,
  prefix,
}) {
  const duplicatePlugin = plugins.find(
    (pluginA) => plugin !== pluginA && methodName in plugin[propName],
  )

  if (duplicatePlugin !== undefined) {
    throw new Error(
      `Plugins "${plugin.fullName}" and "${duplicatePlugin.fullName}" are incompatible: they both define "${prefix}.${methodName}()"`,
    )
  }
}
