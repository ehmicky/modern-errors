import isPlainObj from 'is-plain-obj'

// Validate and normalize `plugin.instanceMethods|staticMethods`
export const normalizeAllMethods = function (plugin) {
  const pluginA = normalizeMethods({
    ...INSTANCE_METHODS,
    plugin,
    propName: 'instanceMethods',
  })
  const pluginB = normalizeMethods({
    ...STATIC_METHODS,
    plugin: pluginA,
    propName: 'instanceMethods',
  })
  const pluginC = normalizeMethods({
    ...STATIC_METHODS,
    plugin: pluginB,
    propName: 'staticMethods',
  })
  return pluginC
}

const INSTANCE_METHODS = {
  coreObject: Error.prototype,
  coreObjectName: 'error',
  forbiddenNames: new Set([]),
}

const STATIC_METHODS = {
  coreObject: Error,
  coreObjectName: 'Error',
  forbiddenNames: new Set(['normalize', 'subclass']),
}

const normalizeMethods = function ({
  plugin,
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
}
