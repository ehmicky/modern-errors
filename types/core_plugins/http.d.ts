import type { Info } from '../main.js'

/**
 * Options of `modern-errors-http`
 */
export interface Options {
  readonly type?: string
  readonly status?: number
  readonly title?: string
  readonly detail?: string
  readonly instance?: string
  readonly stack?: string
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
