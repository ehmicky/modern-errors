import { normalizePluginOpts } from './normalize.js'

// Plugins can define a `staticMethods` object, which is merged to `AnyError.*`.
// We privilege `instanceMethods` when one of the arguments is `error`
//  - We do not pass `error` to static methods to encourage this
//  - We also do not pass class `options`, but we do pass global ones, to allow
//    plugins to configure static methods
export const addAllStaticMethods = function ({
  plugins,
  globalOpts,
  KnownClasses,
  AnyError,
}) {
  plugins.forEach((plugin) => {
    addStaticMethods({ plugin, globalOpts, KnownClasses, AnyError })
  })
}

const addStaticMethods = function ({
  plugin,
  plugin: { staticMethods },
  globalOpts,
  KnownClasses,
  AnyError,
}) {
  if (staticMethods === undefined) {
    return
  }

  Object.entries(staticMethods).forEach(([methodName, methodFunc]) => {
    addStaticMethod({
      methodName,
      methodFunc,
      plugin,
      globalOpts,
      KnownClasses,
      AnyError,
    })
  })
}

const addStaticMethod = function ({
  methodName,
  methodFunc,
  plugin,
  globalOpts,
  KnownClasses,
  AnyError,
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  AnyError[methodName] = callStaticMethods.bind(undefined, {
    methodFunc,
    plugin,
    globalOpts,
    KnownClasses,
    AnyError,
  })
}

const callStaticMethods = function (
  { methodFunc, plugin, globalOpts, KnownClasses, AnyError },
  ...args
) {
  const options = normalizePluginOpts(globalOpts, plugin)
  return methodFunc(
    { options, AnyError, KnownClasses: { ...KnownClasses } },
    ...args,
  )
}
