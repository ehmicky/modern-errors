import { normalizePluginOpts } from '../plugins/normalize.js'

// Plugins can define a `staticMethods` object, which is merged to `AnyError.*`.
// We privilege `instanceMethods` when one of the arguments is `error`
//  - We do not pass `error` to static methods to encourage this
//  - We also do not pass class `options`, but we do pass global ones, to allow
//    plugins to configure static methods
export const addAllStaticMethods = function ({
  plugins,
  globalOpts,
  BaseError,
  state,
}) {
  plugins.forEach((plugin) => {
    addStaticMethods({ plugin, globalOpts, BaseError, state })
  })
}

const addStaticMethods = function ({
  plugin,
  plugin: { staticMethods },
  globalOpts,
  BaseError,
  state,
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
      BaseError,
      state,
    })
  })
}

const addStaticMethod = function ({
  methodName,
  methodFunc,
  plugin,
  globalOpts,
  BaseError,
  state,
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  BaseError[methodName] = callStaticMethods.bind(undefined, {
    methodFunc,
    plugin,
    globalOpts,
    state,
  })
}

const callStaticMethods = function (
  { methodFunc, plugin, globalOpts, state: { KnownClasses, AnyError } },
  ...args
) {
  const options = normalizePluginOpts(globalOpts, plugin)
  return methodFunc(
    { options, AnyError, KnownClasses: { ...KnownClasses } },
    ...args,
  )
}
