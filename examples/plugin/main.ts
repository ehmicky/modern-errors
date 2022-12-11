import type { Info, Plugin } from 'modern-errors'

// /**
//  * Options of `modern-errors-example`
//  */
// export interface Options {
//   /**
//    * Description of `exampleOption`.
//    *
//    * @default true
//    */
//   readonly exampleOption?: boolean
// }

/**
 * `modern-errors-example` plugin.
 *
 * Description of the plugin.
 */
const plugin = {
  // Name used to configure the plugin
  name: 'example' as const,

  // // Set error properties
  // properties: (info: Info<Options>['properties']): { exampleProp: unknown } =>
  //   ({})

  // // Add error instance methods like
  // // `ErrorClass.exampleMethod(error, ...args)`
  // instanceMethods: {
  //   /**
  //    * Description of `ErrorClass.exampleMethod(error)`.
  //    *
  //    * @example
  //    * ```js
  //    * const value = ErrorClass.exampleMethod(error, arg)
  //    * ```
  //    */
  //   exampleMethod: (
  //     info: Info<Options>['instanceMethods'],
  //     ...args: unknown[]
  //   ): void => {
  //     // ...
  //   },
  // },

  // // Add `ErrorClass` static methods like `ErrorClass.staticMethod(...args)`
  // staticMethods: {
  //   /**
  //    * Description of `ErrorClass.staticMethod()`.
  //    *
  //    * @example
  //    * ```js
  //    * const value = ErrorClass.staticMethod(arg)
  //    * ```
  //    */
  //   staticMethod: (
  //     info: Info<Options>['staticMethods'],
  //     ...args: unknown[]
  //   ): void => {
  //     // ...
  //   },
  // },

  // // Validate and normalize options
  // getOptions: (options: Options, full: boolean): Options => options,

  // // Determine if a value is plugin's options
  // isOptions: (options: unknown): boolean => typeof options === 'boolean',
} satisfies Plugin

export default plugin
