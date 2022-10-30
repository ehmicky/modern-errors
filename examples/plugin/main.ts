// import type { Info } from 'modern-errors'

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
export default {
  // Name used to configure the plugin
  name: 'example' as const,

  // // Set error properties
  // properties(info: Info['properties']): { exampleProp: unknown } {
  //   return {}
  // },

  // // Add error instance methods like `error.exampleMethod(...args)`
  // instanceMethods: {
  //   /**
  //    * Description of `error.exampleMethod()`.
  //    *
  //    * @example
  //    * ```js
  //    * const value = error.exampleMethod(arg)
  //    * ```
  //    */
  //   exampleMethod(info: Info['instanceMethods'], ...args: unknown[]): void {
  //     // ...
  //   },
  // },

  // // Add `AnyError` static methods like `AnyError.staticMethod(...args)`
  // staticMethods: {
  //   /**
  //    * Description of `AnyError.staticMethod()`.
  //    *
  //    * @example
  //    * ```js
  //    * const value = AnyError.staticMethod(arg)
  //    * ```
  //    */
  //   staticMethod(info: Info['staticMethods'], ...args: unknown[]): void {
  //     // ...
  //   },
  // },

  // // Validate and normalize options
  // getOptions(options: Options, full: boolean): Options {
  //   return options
  // },

  // // Determine if a value is plugin's options
  // isOptions(options: Options): boolean {
  //   return typeof options === 'boolean'
  // },
}
