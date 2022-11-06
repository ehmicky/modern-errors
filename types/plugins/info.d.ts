import type { ErrorName } from 'error-custom-class'
import type { BaseErrorClass } from '../any/main.js'
import type { ErrorClass } from '../subclass/main/main.js'
import type { ErrorInstance } from '../any/modify/main.js'
import type { Plugins } from './shape.js'

/**
 * Properties shared by all `info` objects.
 */
interface CommonInfo {
  /**
   * Normalized error instance.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   properties({ error }) {
   *     return { isInputError: error.name === 'InputError' }
   *   },
   * }
   * ```
   */
  error: ErrorInstance

  /**
   * Plugin's options, as returned by `getOptions()`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   getOptions(options) {
   *     return options
   *   },
   *   // `new ErrorClass('message', { example: value })` sets `error.example: value`
   *   properties({ options }) {
   *     return { example: options }
   *   },
   * }
   * ```
   */
  readonly options: never

  /**
   * Reference to `BaseError`. This can be used to call `BaseError.normalize()` or
   * `error instanceof BaseError`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   instanceMethods: {
   *     addErrors({ error, BaseError }, errors = []) {
   *       error.errors = errors.map(BaseError.normalize)
   *     },
   *   },
   * }
   * ```
   */
  readonly BaseError: BaseErrorClass<Plugins>

  /**
   * Object with all error classes created with `BaseError.subclass()` or
   * `ErrorClass.subclass()`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   staticMethods: {
   *     isKnownErrorClass({ ErrorClasses }, value) {
   *       return Object.values(ErrorClasses).includes(value)
   *     },
   *   },
   * }
   * ```
   */
  readonly ErrorClasses: {
    BaseError: never
    UnknownError: ErrorClass
    [name: ErrorName]: ErrorClass
  }

  /**
   * Returns the `info` object from a specific `Error`, except from
   * `info.BaseError`, `info.ErrorClasses` and `info.errorInfo`.
   *
   * @example
   * ```js
   * export default {
   *   name: 'example',
   *   staticMethods: {
   *     getLogErrors({ errorInfo }) {
   *       return function logErrors(errors) {
   *         errors.forEach((error) => {
   *           const { options } = errorInfo(error)
   *           console.error(options.example?.stack ? error.stack : error.message)
   *         })
   *       }
   *     },
   *   },
   * }
   * ```
   */
  readonly errorInfo: (error: unknown) => Info['errorInfo']
}

/**
 * `info` is a plain object passed as the first argument to `properties()`,
 * instance methods and static methods.
 *
 * Its members are readonly and should not be mutated, except for `info.error`
 * inside instance methods (not inside `properties()`).
 */
export interface Info {
  /**
   * `info` object passed to `plugin.properties()`
   */
  readonly properties: CommonInfo

  /**
   * `info` object passed to `plugin.instanceMethods.*()`
   */
  readonly instanceMethods: CommonInfo

  /**
   * `info` object passed to `plugin.staticMethods.*()`
   */
  readonly staticMethods: Omit<CommonInfo, 'error'>

  /**
   * `info` object returned by `errorInfo()`
   */
  readonly errorInfo: Omit<
    CommonInfo,
    'BaseError' | 'ErrorClasses' | 'errorInfo'
  >
}

// `Info` is exposed as a type so that plugins can:
//  - Use it if the plugin is written in TypeScript
//  - Optionally export it as part of the parameters of
//    `plugin.properties|instanceMethods|staticMethods()`
// However, the `info` parameter of those methods is left mostly untyped
// because:
//  - TypeScript has some bugs related to identical types not being assignable
//    to themselves
//     - https://github.com/microsoft/TypeScript/issues/49653
//     - https://github.com/microsoft/TypeScript/issues/51399
//  - Identical types happen when two copies of `modern-errors` are installed:
//    the main one, and the one used by the plugin for typing purpose
//  - The TypeScript bugs only happen with complex generic functions,
//    i.e. leaving `info` untyped in `properties|instanceMethods|staticMethods`
//    fixes this problem
// This solution:
//  - Works well with all package managers
//  - Is mostly internal-only and let plugins use `Info` as a regular type
//  - Does not require complex setup for plugins in their `package.json`
//    (such as a combination of `devDependencies` and `optional`
//    `peerDependencies`)
/**
 * Remove the types of all `info.*` members to fix some type conflict issues
 */
type UntypedInfo<SpecificInfo> = {
  [InfoPropName in keyof SpecificInfo]: never
}

/**
 * `info` parameter. Unlike `Info`, this is not meant for plugin declarations,
 * but for plugin consumption.
 */
export type InfoParameter = {
  [InfoName in keyof Info]: UntypedInfo<Info[InfoName]>
}
