import { setNonEnumProp } from '../../utils/descriptors.js'

import { callStaticMethod } from './call.js'

// Plugins can define a `staticMethods` object, which is merged to `AnyError.*`.
// We privilege `instanceMethods` when one of the arguments is `error`
//  - We do not pass `error` to static methods to encourage this
//  - We also do not pass class `options`, but we do pass global ones, to allow
//    plugins to configure static methods
// State in plugins:
//  - `modern-errors` does not have mutable state
//     - This allows declaring error classes in the top-level state, instead of
//       passing them around as variables
//  - Plugins can keep error-specific state using a WeakMap in the top-level
//    scope
//  - For other state:
//     - Such as network connection, class instance, etc.
//     - If this is fast enough, the state can be created and deleted inside a
//       single plugin method
//     - Otherwise:
//        - Users should create the state object, pass it to plugin methods, and
//          potentially destroy it
//        - Plugins can provide with methods to simplify creating those state
//          objects
//           - But those must be returned as local variables, not stored as
//             global state
//        - reasons:
//           - This keeps the API simple, shifting consumer-specific or
//             tool-specific logic to consumers
//           - This is concurrent-safe
//           - This ensures instance methods are used instead of passing errors
//             to static methods
//              - For consistency
//              - To ensure method options can be passed
// We do not provide with `plugin.init()`:
//  - This would encourage stateful plugins
//  - Instead, static methods that initialize should be used
export const addAllStaticMethods = function ({
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  plugins.forEach((plugin) => {
    addStaticMethods({
      plugin,
      plugins,
      ErrorClasses,
      errorData,
      AnyError,
    })
  })
}

const addStaticMethods = function ({
  plugin,
  plugin: { staticMethods },
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  Object.entries(staticMethods).forEach(
    addStaticMethod.bind(undefined, {
      plugin,
      plugins,
      ErrorClasses,
      errorData,
      AnyError,
    }),
  )
}

const addStaticMethod = function (
  { plugin, plugins, ErrorClasses, errorData, AnyError },
  [methodName, methodFunc],
) {
  validateMethodName(methodName, plugin, AnyError)
  setNonEnumProp(
    AnyError,
    methodName,
    callStaticMethod.bind(undefined, {
      methodFunc,
      plugin,
      plugins,
      ErrorClasses,
      errorData,
      AnyError,
    }),
    function boundStaticMethod(...args) {
      return callStaticMethod({
        methodFunc,
        methodName,
        plugin,
        plugins,
        // eslint-disable-next-line fp/no-this, no-invalid-this
        ErrorClass: this,
        ErrorClasses,
        errorData,
        AnyError,
        args,
      })
    },
  )
}

const validateMethodName = function (methodName, plugin, AnyError) {
  if (methodName in AnyError) {
    throw new Error(
      `Plugin "${plugin.fullName}" must not redefine "AnyError.${methodName}()"`,
    )
  }
}
