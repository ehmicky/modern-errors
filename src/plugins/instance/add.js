import { validateDuplicatePlugin } from '../duplicate.js'

import { callInstanceMethod } from './call.js'

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
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  Object.entries(plugin.instanceMethods).forEach(
    addInstanceMethod.bind(undefined, {
      plugin,
      plugins,
      ErrorClasses,
      errorData,
      AnyError,
    }),
  )
}

const addInstanceMethod = function (
  { plugin, plugins, ErrorClasses, errorData, AnyError },
  [methodName, methodFunc],
) {
  validateMethodName(methodName, plugin, plugins)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(AnyError.prototype, methodName, {
    value(...args) {
      return callInstanceMethod({
        // eslint-disable-next-line fp/no-this
        error: this,
        methodFunc,
        methodName,
        plugin,
        plugins,
        ErrorClasses,
        errorData,
        AnyError,
        args,
      })
    },
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

  const propName = 'instanceMethods'
  const prefix = 'error'
  validateDuplicatePlugin({ methodName, plugin, plugins, propName, prefix })
}
