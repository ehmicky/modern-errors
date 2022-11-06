// Ensure the same plugin is not passed twice.
// Also ensure two plugins do not define the same instanceMethods|staticMethods
export const validateDuplicatePlugins = function (plugins, ParentError) {
  plugins.forEach((pluginA, indexA) => {
    validateDuplicatePlugin({ pluginA, indexA, plugins, ParentError })
  })
}

const validateDuplicatePlugin = function ({
  pluginA,
  indexA,
  plugins,
  ParentError,
}) {
  plugins.forEach((pluginB, indexB) => {
    validateEachPlugin({ pluginA, pluginB, indexA, indexB, ParentError })
  })
}

const validateEachPlugin = function ({
  pluginA,
  pluginB,
  indexA,
  indexB,
  ParentError,
}) {
  if (indexA === indexB) {
    return
  }

  if (pluginA.name === pluginB.name) {
    throw new TypeError(
      `${ParentError.name}.subclass() "plugins" option must not include "${pluginA.fullName}": this plugin has already been included.`,
    )
  }

  validateDuplicateMethods(pluginA, pluginB, 'staticMethods')
  validateDuplicateMethods(pluginA, pluginB, 'instanceMethods')
}

const validateDuplicateMethods = function (pluginA, pluginB, propName) {
  Object.keys(pluginA[propName]).forEach((methodName) => {
    validateDuplicateMethod({ pluginA, pluginB, propName, methodName })
  })
}

const validateDuplicateMethod = function ({
  pluginA,
  pluginB,
  propName,
  methodName,
}) {
  if (pluginB[propName][methodName] !== undefined) {
    throw new TypeError(
      `The plugins "${pluginA.fullName}" and "${pluginB.fullName}" must not both define the same "${propName}.${methodName}" property.`,
    )
  }
}
