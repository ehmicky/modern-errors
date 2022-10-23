import type { Plugin, Plugins } from './plugins/main.js'
import type { Info } from './plugins/info.js'
import type { AnyErrorClass, SpecificAnyErrorClass } from './any.js'
import type { ErrorClass } from './class.js'
import type { ErrorInstance } from './instance.js'
import type { PluginsOptions } from './options/plugins.js'
import type { MethodOptions } from './options/method.js'
import type { InstanceOptions } from './options/instance.js'
import type { ClassOptions } from './options/class.js'
import type { GlobalOptions } from './options/global.js'
import type { GetPropsOption } from './props.js'

export type {
  Plugin,
  Info,
  MethodOptions,
  InstanceOptions,
  ClassOptions,
  GlobalOptions,
  ErrorInstance,
  ErrorClass,
  AnyErrorClass,
}

// Known limitations of current types:
//  - Plugin methods cannot be generic
//  - If two `plugin.properties()` (or `props`) return the same property, they
//    are intersected using `&`, instead of the second one overriding the first.
//    Therefore, the type of `plugin.properties()` that are not unique should
//    currently be wide to avoid the `&` intersection resulting in `undefined`.
//  - Type narrowing with `instanceof` does not work with:
//     - Any error class with a `custom` option
//     - `AnyError` if there are any plugins with static methods
//    This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/50844
//  - `new AnyError()` should fail if the second argument is not an object with
//    a `cause` property
//  - When a `custom` class overrides a plugin's instance method, it must be
//    set as a class property `methodName = (...) => ...` instead of as a
//    method `methodName(...) { ... }`.
//    This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/48125
//  - When a `custom` class overrides a core error property, a plugin's
//    `properties()` or `instanceMethods`, or `props`, it should work even if
//    it is not a subtype of it
//  - When wrapping an error as `cause`:
//     - The following are ignored, which is expected:
//        - Error core properties
//        - Class-specific properties: `custom` methods, instance methods,
//          `plugin.properties()` and `props`
//     - However, the following should be kept and are currently not:
//        - Properties set after instantiation
//        - `custom` instance properties
// Minor limitations:
//  - Plugin static methods should not be allowed to override `Error.*`
//    (e.g. `prepareStackTrace()`)
//  - Plugins should not be allowed to define static or instance methods already
//    defined by other plugins
//  - Error normalization (`AnyError.normalize()` and aggregate `errors`) is not
//    applied on errors coming from another `modernErrors()` call, even though
//    it should (as opposed to errors coming from the same `modernErrors()`
//    call)
/**
 * Creates and returns `AnyError`.
 *
 * @example
 * ```js
 *  // Base error class
 *  export const AnyError = modernErrors()
 *
 *  // The first error class must be named "UnknownError"
 *  export const UnknownError = AnyError.subclass('UnknownError')
 *  export const InputError = AnyError.subclass('InputError')
 *  export const AuthError = AnyError.subclass('AuthError')
 *  export const DatabaseError = AnyError.subclass('DatabaseError')
 * ```
 */
export default function modernErrors<
  PluginsArg extends Plugins = [],
  GlobalOptionsArg extends PluginsOptions<PluginsArg> = {},
>(
  plugins?: PluginsArg,
  options?: GlobalOptionsArg,
): SpecificAnyErrorClass<PluginsArg, GetPropsOption<GlobalOptionsArg>>
