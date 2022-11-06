import isPlainObj from 'is-plain-obj'

export const normalizeMethods = function ({
  plugin,
  plugins,
  propName,
  coreObject,
  coreObjectName,
  forbiddenNames,
}) {
  const methods = plugin[propName] ?? {}

  if (!isPlainObj(methods)) {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${propName}" property must be either undefined or a plain object, not: ${methods}`,
    )
  }

  Object.entries(methods).forEach(([methodName, methodValue]) => {
    validateMethod({
      methodValue,
      propName,
      methodName,
      plugin,
      plugins,
      coreObject,
      coreObjectName,
      forbiddenNames,
    })
  })
  return { ...plugin, [propName]: methods }
}

const validateMethod = function ({
  methodValue,
  propName,
  methodName,
  plugin,
  plugins,
  coreObject,
  coreObjectName,
  forbiddenNames,
}) {
  if (typeof methodValue !== 'function') {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${propName}.${methodName}" property must be a function, not: ${methodValue}`,
    )
  }

  if (forbiddenNames.has(methodName) || methodName in coreObject) {
    throw new TypeError(
      `The plugin "${plugin.fullName}"'s "${propName}.${methodName}" property name is invalid: "${coreObjectName}.${methodName}" already exists.`,
    )
  }

  validateDuplicateMethod({ propName, methodName, plugin, plugins })
}

const validateDuplicateMethod = function ({
  propName,
  methodName,
  plugin,
  plugins,
}) {
  const duplicatePlugin = plugins.find(
    (pluginA) =>
      pluginA[propName]?.[methodName] !== undefined &&
      pluginA.name !== plugin.name,
  )

  if (duplicatePlugin !== undefined) {
    throw new TypeError(
      `Both plugins "${plugin.fullName}" and "${duplicatePlugin.fullName}" must not define the same "${propName}.${methodName}" property.`,
    )
  }
}
