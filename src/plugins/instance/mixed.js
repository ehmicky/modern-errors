import { callMethod } from './call.js'

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
