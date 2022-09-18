import { validateNonEmpty } from '../any/subclass.js'

import { getErrorClasses } from './error_classes.js'
import { normalizePluginOpts } from './normalize.js'

// Plugins can define a `staticMethods` object, which is merged to `AnyError.*`.
// We privilege `instanceMethods` when one of the arguments is `error`
//  - We do not pass `error` to static methods to encourage this
//  - We also do not pass class `options`, but we do pass global ones, to allow
//    plugins to configure static methods
export const addAllStaticMethods = function ({
  plugins,
  globalOpts,
  ErrorClasses,
  AnyError,
}) {
  plugins.forEach((plugin) => {
    addStaticMethods({ plugin, plugins, globalOpts, ErrorClasses, AnyError })
  })
}

const addStaticMethods = function ({
  plugin,
  plugin: { staticMethods },
  plugins,
  globalOpts,
  ErrorClasses,
  AnyError,
}) {
  Object.entries(staticMethods).forEach(([methodName, methodFunc]) => {
    addStaticMethod({
      methodName,
      methodFunc,
      plugin,
      plugins,
      globalOpts,
      ErrorClasses,
      AnyError,
    })
  })
}

const addStaticMethod = function ({
  methodName,
  methodFunc,
  plugin,
  plugins,
  globalOpts,
  ErrorClasses,
  AnyError,
}) {
  validateMethodName(methodName, plugin, plugins)
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  AnyError[methodName] = callStaticMethods.bind(undefined, {
    methodFunc,
    plugin,
    globalOpts,
    ErrorClasses,
    AnyError,
  })
}

const validateMethodName = function (methodName, plugin, plugins) {
  const duplicatePlugin = plugins.find(
    (pluginA) => plugin !== pluginA && methodName in plugin.staticMethods,
  )

  if (duplicatePlugin !== undefined) {
    throw new Error(
      `Plugins "${plugin.fullName}" and "${duplicatePlugin.fullName}" are incompatible: they both define "AnyError.${methodName}()"`,
    )
  }
}

const callStaticMethods = function (
  { methodFunc, plugin, globalOpts, ErrorClasses, AnyError },
  ...args
) {
  validateNonEmpty(ErrorClasses)
  const options = normalizePluginOpts(globalOpts, plugin)
  return methodFunc(
    { options, AnyError, ErrorClasses: getErrorClasses(ErrorClasses) },
    ...args,
  )
}
