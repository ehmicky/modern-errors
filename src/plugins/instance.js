import { validateDuplicatePlugin } from './duplicate.js'
import { getErrorClasses } from './error_classes.js'
import { applyIsOptions } from './method_opts.js'
import { normalizePluginOpts } from './normalize.js'

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
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(AnyError.prototype, methodName, {
    value(...args) {
      return callInstanceMethod({
        // eslint-disable-next-line fp/no-this
        error: this,
        methodFunc,
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

  validateDuplicatePlugin({
    methodName,
    plugin,
    plugins,
    propName: 'instanceMethods',
    prefix: 'error',
  })
}

const callInstanceMethod = function ({
  error,
  methodFunc,
  plugin,
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
  args,
}) {
  const { pluginsOpts } = errorData.get(error)
  const { args: argsA, pluginsOpts: pluginsOptsA } = applyIsOptions({
    args,
    pluginsOpts,
    plugin,
    plugins,
  })
  return methodFunc(
    {
      options: normalizePluginOpts(pluginsOptsA, plugin, true),
      allOptions: pluginsOptsA,
      error,
      AnyError,
      ErrorClasses: getErrorClasses(ErrorClasses),
    },
    ...argsA,
  )
}
