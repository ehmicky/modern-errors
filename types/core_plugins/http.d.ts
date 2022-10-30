import type { Info } from '../main.js'

/**
 * Options of `modern-errors-http`
 */
export interface Options {
  /**
   * URI identifying and documenting the error class. Ideally, each error class
   * [should set one](https://github.com/ehmicky/modern-errors/README.md#plugin-options).
   *
   * @default undefined
   */
  readonly type?: string

  /**
   * HTTP status code.
   *
   * @default undefined
   */
  readonly status?: number

  /**
   * Error class name.
   *
   * @default error.name
   */
  readonly title?: string

  /**
   * Error description.
   *
   * @default error.message
   */
  readonly detail?: string

  /**
   * URI identifying the value which errored.
   *
   * @default undefined
   */
  readonly instance?: string

  /**
   * Error stack trace. Can be set to an empty string.
   *
   * @default error.stack
   */
  readonly stack?: string

  /**
   * Additional information. This is always
   * [safe to serialize as JSON](https://github.com/ehmicky/safe-json-value).
   * Can be set to an empty object.
   *
   * @default any additional `error` properties
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
declare const plugin: {
  name: 'http'
  getOptions: (input: Options) => Options
  instanceMethods: {
    /**
     * Converts `error` to a plain object to use in an HTTP response.
     * Its shape follows [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807)
     * ("problem details").
     *
     * @example
     * ```js
     * const object = error.httpResponse()
     * // {
     * //   type: 'https://example.com/probs/auth',
     * //   status: 401,
     * //   title: 'AuthError',
     * //   detail: 'Could not authenticate.',
     * //   instance: '/users/62',
     * //   stack: `AuthError: Could not authenticate.
     * //     at ...`,
     * //   extra: { userId: 62 },
     * // }
     * ```
     */
    httpResponse: (info: Info['staticMethods']) => HttpResponse
  }
}
export default plugin
