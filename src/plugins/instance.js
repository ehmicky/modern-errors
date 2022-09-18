import { validateDuplicatePlugin } from './duplicate.js'
import { getErrorClasses } from './error_classes.js'
import { getErrorOpts } from './normalize.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `AnyError.prototype.*`.
export const addAllInstanceMethods = function ({
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  plugins.forEach((plugin) => {
    addInstanceMethods({ plugin, plugins, ErrorClasses, errorData, AnyError })
  })
}

const addInstanceMethods = function ({
  plugin,
  plugin: { instanceMethods },
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  Object.entries(instanceMethods).forEach(([methodName, methodFunc]) => {
    addInstanceMethod({
      methodName,
      methodFunc,
      plugin,
      plugins,
      ErrorClasses,
      errorData,
      AnyError,
    })
  })
}

const addInstanceMethod = function ({
  methodName,
  methodFunc,
  plugin,
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  validateMethodName(methodName, plugin, plugins)

  const value = function (...args) {
    // eslint-disable-next-line fp/no-this, no-invalid-this, consistent-this, unicorn/no-this-assignment
    const error = this
    const options = getErrorOpts(error, errorData, plugin)
    return methodFunc(
      { error, options, AnyError, ErrorClasses: getErrorClasses(ErrorClasses) },
      ...args,
    )
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(AnyError.prototype, methodName, {
    value,
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

const validateMethodName = function (methodName, plugin, plugins) {
  if (methodName in Error.prototype) {
    throw new Error(
      `Plugin "${plugin.fullName}" must not redefine "error.${methodName}()"`,
    )
  }

  validateDuplicatePlugin({
    methodName,
    plugin,
    plugins,
    propName: 'instanceMethods',
    prefix: 'error',
  })
}
