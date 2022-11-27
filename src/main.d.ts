import type { ErrorInstance } from './merge/cause/main.js'
import type { ClassOptions } from './options/class.js'
import type { InstanceOptions } from './options/instance.js'
import type { MethodOptions } from './options/method.js'
import type { Info } from './plugins/info/main.js'
import type { Plugin } from './plugins/shape/main.js'
import type { ErrorClass, SpecificErrorClass } from './subclass/create/main.js'
import type { CustomClass } from './subclass/custom/main.js'

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
 * Top-level `ErrorClass`.
 *
 * @example
 * ```js
 * export const BaseError = ModernError.subclass('BaseError')
 *
 * export const UnknownError = BaseError.subclass('UnknownError')
 * export const InputError = BaseError.subclass('InputError')
 * export const AuthError = BaseError.subclass('AuthError')
 * export const DatabaseError = BaseError.subclass('DatabaseError')
 * ```
 */
declare const ModernError: SpecificErrorClass<[], {}, CustomClass>
export default ModernError

// Major limitations of current types:
//  - Plugin methods cannot be generic
//  - Plugin types can use `ErrorClass` or `Info`, but not export them.
//    See the comment in info.d.ts for an explanation.
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
//    are intersected using `&`, instead of the second one overriding the first
//     - Therefore, the type of `plugin.properties()` that are not unique should
//       currently be wide to avoid the `&` intersection resulting in
//       `undefined`
//     - This problem does not apply to error core properties (`message` and
//       `stack`) which are always kept correct
//  - Type narrowing with `instanceof` does not work if there are any plugins
//    with instance|static methods. This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/50844
//  - When a `custom` class overrides a plugin's instance method, it must be
//    set as a class property `methodName = (...) => ...` instead of as a
//    method `methodName(...) { ... }`. This is due to the following bug:
//      https://github.com/microsoft/TypeScript/issues/48125
//  - When a `custom` class overrides a core error property, a plugin's
//    `instanceMethods`, `properties()` or `props`, it should work even if it is
//    not a subtype of it
//  - `ErrorClass.subclass(..., { custom })` should fail if `custom` is not
//    directly extending from `ErrorClass`, but it currently always succeed
//    except when either:
//     - `custom` class is not a `ModernError`
//     - `ErrorClass` (or a parent) has a `custom` class itself
//  - Defining the same plugin twice should fail, but it is a noop instead
// Minor limitations:
//  - Plugin instance|static methods should not be allowed to override `Error.*`
//    (e.g. `prepareStackTrace()`)
//  - Plugins should not be allowed to define instance|static methods already
//    defined by other plugins
