import { validateNonEmpty } from '../any/subclass.js'
import { ANY_ERROR_STATIC_METHODS } from '../subclass/inherited.js'

import { validateDuplicatePlugin } from './duplicate.js'
import { getPluginInfo } from './info.js'
import { mergeMethodOpts } from './method_opts.js'

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
  Object.entries(staticMethods).forEach(
    addStaticMethod.bind(undefined, {
      plugin,
      plugins,
      globalOpts,
      ErrorClasses,
      AnyError,
    }),
  )
}

const addStaticMethod = function (
  { plugin, plugins, globalOpts, ErrorClasses, AnyError },
  [methodName, methodFunc],
) {
  validateMethodName(methodName, plugin, plugins)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(AnyError, methodName, {
    value: callStaticMethod.bind(undefined, {
      methodFunc,
      plugin,
      plugins,
      globalOpts,
      ErrorClasses,
      AnyError,
    }),
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

const validateMethodName = function (methodName, plugin, plugins) {
  if (methodName in Error || ANY_ERROR_STATIC_METHODS.includes(methodName)) {
    throw new Error(
      `Plugin "${plugin.fullName}" must not redefine "AnyError.${methodName}()"`,
    )
  }

  const propName = 'staticMethods'
  const prefix = 'AnyError'
  validateDuplicatePlugin({ methodName, plugin, plugins, propName, prefix })
}

const callStaticMethod = function (
  { methodFunc, plugin, plugins, globalOpts, ErrorClasses, AnyError },
  ...args
) {
  validateNonEmpty(ErrorClasses)
  const { args: argsA, pluginsOpts } = mergeMethodOpts({
    args,
    pluginsOpts: globalOpts,
    plugin,
    plugins,
  })
  const info = getPluginInfo({ pluginsOpts, plugin, AnyError, ErrorClasses })
  return methodFunc(info, ...argsA)
}
