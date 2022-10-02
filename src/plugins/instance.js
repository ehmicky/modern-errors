import { validateDuplicatePlugin } from './duplicate.js'
import { getPluginInfo } from './info.js'
import { mergeClassOpts } from './merge.js'
import { mergeMethodOpts } from './method_opts.js'

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
  const arg = { plugin, plugins, ErrorClasses, errorData, AnyError }
  Object.entries(instanceMethods).forEach(
    addInstanceMethod.bind(undefined, arg),
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
  const { pluginsOpts, unknownDeep } = errorData.get(error)
  const pluginsOptsA = mergeClassOpts({
    error,
    ErrorClasses,
    plugins,
    pluginsOpts,
  })
  const { args: argsA, pluginsOpts: pluginsOptsB } = mergeMethodOpts({
    args,
    pluginsOpts: pluginsOptsA,
    plugin,
    plugins,
  })
  const info = getPluginInfo({
    pluginsOpts: pluginsOptsB,
    plugin,
    AnyError,
    ErrorClasses,
  })
  return methodFunc({ ...info, error, unknownDeep }, ...argsA)
}
