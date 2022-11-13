import type { Plugin } from './plugins/shape.js'
import type { Info } from './plugins/info.js'
import type { ErrorInstance } from './base/modify/main.js'
import type { ErrorClass, SpecificErrorClass } from './subclass/main/main.js'
import type { CustomClass } from './subclass/parent/main.js'
import type { MethodOptions } from './options/method.js'
import type { InstanceOptions } from './options/instance.js'
import type { ClassOptions } from './options/class.js'

export type {
  Plugin,
  Info,
  MethodOptions,
  InstanceOptions,
  ClassOptions,
  ErrorInstance,
  ErrorClass,
}

/**
 * Creates and returns `BaseError`.
 *
 * @example
 * ```js
 *  // Base error class
 *  export const BaseError = modernErrors()
 *
 *  // The first error class must be named "UnknownError"
 *  export const UnknownError = BaseError.subclass('UnknownError')
 *  export const InputError = BaseError.subclass('InputError')
 *  export const AuthError = BaseError.subclass('AuthError')
 *  export const DatabaseError = BaseError.subclass('DatabaseError')
 * ```
 */
declare const ModernError: SpecificErrorClass<[], {}, CustomClass>
export default ModernError

// Major limitations of current types:
//  - Plugin methods cannot be generic
//  - When wrapping an error as `cause` without `BaseError`:
//     - The following properties of `cause` are ignored, which is expected:
//        - Error core properties
//        - Class-specific properties: `custom` methods, instance methods,
//          `plugin.properties()` and `props`
//     - However, the following should be kept and are currently not:
//        - Properties set after instantiation
//        - `custom` instance properties
// Medium limitations:
//  - Some logic relies on determining if an error class is a subclass of
//    another
//     - However, this is not perfectly possible with TypeScript since it is
//       based on structural typing
//        - Unrelated classes will be considered identical if they have the same
//          options
//        - The `props` and `plugins` option do manage to create proper
//          inheritance, but not the `custom` option
//     - This impacts:
//        - `ErrorClass.normalize()` second argument might not always fail when
//          it is not a subclass of `ErrorClass`
//        - `ErrorClass.normalize(new ErrorClass(''), ErrorSubClass)` returns
//          an instance of `ErrorClass` instead of `ErrorSubclass`
//  - If two `plugin.properties()` (or `props`) return the same property, they
//    are intersected using `&`, instead of the second one overriding the first.
//     - Therefore, the type of `plugin.properties()` that are not unique should
//       currently be wide to avoid the `&` intersection resulting in
//       `undefined`
//     - This problem does not apply to error core properties (`message` and
//       `stack`) which are always kept correct
//  - Type narrowing with `instanceof` does not work if there are any plugins
//    with static methods. This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/50844
//  - When a `custom` class overrides a plugin's instance method, it must be
//    set as a class property `methodName = (...) => ...` instead of as a
//    method `methodName(...) { ... }`. This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/48125
//  - When a `custom` class overrides a core error property, a plugin's
//    `instanceMethods`, `properties()` or `props`, it should work even if it is
//    not a subtype of it
//  - Error normalization (`BaseError.normalize()`) is not applied on errors
//    coming from another `modernErrors()` call, even though it should (as
//    opposed to errors coming from the same `modernErrors()` call)
//  - `ErrorClass.subclass(..., { custom })`:
//     - Currently fails if `custom` is not an `BaseError` child, which is
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
