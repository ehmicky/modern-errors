import { validateNonEmpty } from '../any/subclass.js'
import { ANY_ERROR_STATIC_METHODS } from '../subclass/inherited.js'

import { validateDuplicatePlugin } from './duplicate.js'
import { getErrorClasses } from './error_classes.js'
import { applyIsOptions } from './method_opts.js'
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
  AnyError[methodName] = callStaticMethod.bind(undefined, {
    methodFunc,
    plugin,
    plugins,
    globalOpts,
    ErrorClasses,
    AnyError,
  })
}

const validateMethodName = function (methodName, plugin, plugins) {
  if (methodName in Error || ANY_ERROR_STATIC_METHODS.includes(methodName)) {
    throw new Error(
      `Plugin "${plugin.fullName}" must not redefine "AnyError.${methodName}()"`,
    )
  }

  validateDuplicatePlugin({
    methodName,
    plugin,
    plugins,
    propName: 'staticMethods',
    prefix: 'AnyError',
  })
}

const callStaticMethod = function (
  { methodFunc, plugin, plugins, globalOpts, ErrorClasses, AnyError },
  ...args
) {
  validateNonEmpty(ErrorClasses)
  const { args: argsA, pluginsOpts } = applyIsOptions({
    args,
    pluginsOpts: globalOpts,
    plugin,
    plugins,
  })
  return methodFunc(
    {
      options: normalizePluginOpts(pluginsOpts, plugin, true),
      AnyError,
      ErrorClasses: getErrorClasses(ErrorClasses),
    },
    ...argsA,
  )
}
