import { getMethodOpts } from '../../options/method.js'
import { getErrorPluginInfo } from '../info/main.js'

// Called on `error[methodName](...args)`
export const callInstanceMethod = function ({
  error,
  methodFunc,
  methodName,
  plugin,
  plugins,
  ErrorClass,
  args,
}) {
  if (!(error instanceof ErrorClass)) {
    throw new TypeError(
      `Missing "this" context: "${methodName}()" must be called using "error.${methodName}()"`,
    )
  }

  return callMethod({ methodFunc, plugin, plugins, error, args })
}

// Called on `ErrorClass[methodName](error, ...args)`
// All instance methods are also available as static methods
//  - This reduces the potential for the common mistake of calling
//    `error[methodName]` without first normalizing `error`
//  - This is the preferred way, which should be solely documented
//  - `error[methodName]` still has a few use cases though:
//     - Method chaining
//     - Known methods, e.g. `error.toJSON()`
export const callMixedMethod = function (
  { methodFunc, plugin, plugins, ErrorClass },
  error,
  ...args
) {
  const errorA = ErrorClass.normalize(error)
  return callMethod({ methodFunc, plugin, plugins, error: errorA, args })
}

const callMethod = function ({ methodFunc, plugin, plugins, error, args }) {
  const { args: argsA, methodOpts } = getMethodOpts(args, plugin)
  const info = getErrorPluginInfo({ error, methodOpts, plugins, plugin })
  return methodFunc(info, ...argsA)
}
