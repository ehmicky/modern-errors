import type { Plugin, Plugins } from './plugins/shape.js'
import type { Info } from './plugins/info.js'
import type { AnyErrorClass, SpecificAnyErrorClass } from './any/main.js'
import type { ErrorClass } from './subclass/main/main.js'
import type { ErrorInstance } from './any/modify/main.js'
import type { PluginsOptions } from './options/plugins.js'
import type { MethodOptions } from './options/method.js'
import type { InstanceOptions } from './options/instance.js'
import type { ClassOptions } from './options/class.js'
import type { GlobalOptions } from './options/global.js'
import type { GetPropsOption } from './core_plugins/props/main.js'

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

// Major limitations of current types:
//  - Plugin methods cannot be generic
//  - When wrapping an error as `cause` without `AnyError`:
//     - The following properties of `cause` are ignored, which is expected:
//        - Error core properties
//        - Class-specific properties: `custom` methods, instance methods,
//          `plugin.properties()` and `props`
//     - However, the following should be kept and are currently not:
//        - Properties set after instantiation
//        - `custom` instance properties
// Medium limitations:
//  - If two `plugin.properties()` (or `props`) return the same property, they
//    are intersected using `&`, instead of the second one overriding the first.
//     - Therefore, the type of `plugin.properties()` that are not unique should
//       currently be wide to avoid the `&` intersection resulting in
//       `undefined`
//     - This problem does not apply to error core properties (`message` and
//       `stack`) which are always kept correct
//  - Type narrowing with `instanceof AnyError` does not work if there are any
//    plugins with static methods. This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/50844
//  - `new AnyError()` should fail if the second argument is not an object with
//    a `cause` property
//  - When a `custom` class overrides a plugin's instance method, it must be
//    set as a class property `methodName = (...) => ...` instead of as a
//    method `methodName(...) { ... }`. This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/48125
//  - When a `custom` class overrides a core error property, a plugin's
//    `instanceMethods`, `properties()` or `props`, it should work even if it is
//    not a subtype of it
//  - Error normalization (`AnyError.normalize()` and aggregate `errors`) is not
//    applied on errors coming from another `modernErrors()` call, even though
//    it should (as opposed to errors coming from the same `modernErrors()`
//    call)
//  - `ErrorClass.subclass(..., { custom })`:
//     - Currently fails if `custom` is not an `AnyError` child, which is
//       expected
//     - Fails if `custom` is extending from a parent type of `ErrorClass`, but
//       only if that parent type has a `custom` option itself
//     - Should always fail if `custom` is extending from a child type of
//       `ErrorClass` (as opposed to `ErrorClass` itself)
// Minor limitations:
//  - Plugin static methods should not be allowed to override `Error.*`
//    (e.g. `prepareStackTrace()`)
//  - Plugins should not be allowed to define static or instance methods already
//    defined by other plugins
