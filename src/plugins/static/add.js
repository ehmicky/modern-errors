import { ANY_ERROR_STATIC_METHODS } from '../../subclass/inherited.js'
import { validateDuplicatePlugin } from '../duplicate.js'

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
// - Plugins can keep error-specific state using a WeakMap in the top-level
//   scope
// - For other state:
//    - Such as network connection, class instance, etc.
//    - If this is fast enough, the state can be created and deleted inside a
//      single plugin method
//    - Otherwise:
//       - Users should create the state object, pass it to plugin methods, and
//         potentially destroy it
//       - Plugins can provide with methods to simplify creating those state
//         objects
//          - But those must be returned as local variables, not stored as
//            global state
//       - reasons:
//          - This keeps the API simple, shifting consumer-specific or
//            tool-specific logic to consumers
//          - This is concurrent-safe
//          - This ensures instance methods are used instead of passing errors
//            to static methods
//             - For consistency
//             - To ensure method options can be passed
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
