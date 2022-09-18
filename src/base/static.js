import { normalizePluginOpts } from '../plugins/normalize.js'

// Plugins can define a `staticMethods` object, which is merged to `AnyError.*`.
// We privilege `instanceMethods` when one of the arguments is `error`
//  - We do not pass `error` to static methods to encourage this
//  - We also do not pass class `options`, but we do pass global ones, to allow
//    plugins to configure static methods
export const addAllStaticMethods = function ({
  plugins,
  globalOpts,
  AnyError,
  state,
}) {
  plugins.forEach((plugin) => {
    addStaticMethods({ plugin, globalOpts, AnyError, state })
  })
}

const addStaticMethods = function ({
  plugin,
  plugin: { staticMethods },
  globalOpts,
  AnyError,
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
      AnyError,
      state,
    })
  })
}

const addStaticMethod = function ({
  methodName,
  methodFunc,
  plugin,
  globalOpts,
  AnyError,
  state,
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  AnyError[methodName] = callStaticMethods.bind(undefined, {
    methodFunc,
    plugin,
    globalOpts,
    AnyError,
    state,
  })
}

const callStaticMethods = function (
  { methodFunc, plugin, globalOpts, AnyError, state: { KnownClasses } },
  ...args
) {
  const options = normalizePluginOpts(globalOpts, plugin)
  return methodFunc(
    { options, AnyError, KnownClasses: { ...KnownClasses } },
    ...args,
  )
}
