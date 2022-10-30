import type { Info } from 'modern-errors'

/**
 * Options of `modern-errors-example`
 */
export interface Options {
  /**
   * Description of `exampleOption`.
   *
   * @default true
   */
  readonly exampleOption?: boolean
}

/**
 * `modern-errors-example` plugin.
 *
 * Description of the plugin.
 */
declare const plugin: {
  name: 'example'

  properties: (info: Info['properties']) => { exampleProp: unknown }

  instanceMethods: {
    /**
     * Description of `error.exampleMethod()`.
     *
     * @example
     * ```js
     * const value = error.exampleMethod(arg)
     * ```
     */
    exampleMethod: (info: Info['instanceMethods'], arg: unknown) => unknown
  }

  staticMethods: {
    /**
     * Description of `AnyError.staticMethod()`.
     *
     * @example
     * ```js
     * const value = AnyError.staticMethod(arg)
     * ```
     */
    staticMethod: (info: Info['staticMethods'], arg: unknown) => unknown
  }

  getOptions: (input: Options, full: boolean) => Options

  isOptions: (input: Options) => boolean
}
export default plugin
