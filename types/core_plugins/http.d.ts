import type { Info } from '../main.js'

/**
 * Options of `modern-errors-http`
 */
export interface Options {
  /**
   * URI identifying and documenting the error class. Ideally, each error class
   * [should set one](https://github.com/ehmicky/modern-errors/README.md#plugin-options).
   */
  readonly type?: string

  /**
   * HTTP status code.
   */
  readonly status?: number

  /**
   * Error class name.
   */
  readonly title?: string

  /**
   * Error description.
   */
  readonly detail?: string

  /**
   * URI identifying the value which errored.
   */
  readonly instance?: string

  /**
   * Error stack trace. Can be set to an empty string.
   */
  readonly stack?: string

  /**
   * Additional information. This is always
   * [safe to serialize as JSON](https://github.com/ehmicky/safe-json-value).
   * Can be set to an empty object.
   */
  readonly extra?: object
}

/**
 * `error.httpResponse()`'s return value
 */
export interface HttpResponse extends Options {
  readonly title: string
  readonly detail: string
  readonly stack: string
}

/**
 * `modern-errors-http` plugin
 */
export default plugin
declare const plugin: {
  name: 'http'
  getOptions: (input: Options) => Options
  instanceMethods: {
    httpResponse: (info: Info['staticMethods']) => HttpResponse
  }
}
