import type { Format } from 'logform'

import type { Info } from '../main.js'

/**
 * Winston format.
 */
export type { Format }

/**
 * Options of `modern-errors-winston`
 */
export interface Options {
  /**
   * Log [level](https://github.com/winstonjs/winston#logging-levels).
   *
   * @default 'error'
   */
  readonly level?: string

  /**
   * Whether to log the stack trace.
   *
   * @default `true` if the error (or one of its
   * [inner](https://github.com/ehmicky/modern-errors/README.md#wrap-errors)
   * errors) is
   * [_unknown_](https://github.com/ehmicky/modern-errors/README.md#unknown-errors),
   * and `false` otherwise
   */
  readonly stack?: boolean
}

/**
 * `modern-errors-winston` plugin (Node.js only).
 *
 * Errors can be logged with [Winston](https://github.com/winstonjs/winston)
 * using
 * [`winston.error(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
 */
declare const plugin: {
  name: 'winston'
  getOptions: (input: Options) => Options
  staticMethods: {
    /**
     * The logger
     * [`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
     * must be `AnyError.fullFormat()`
     * [combined](https://github.com/winstonjs/winston#combining-formats) with
     * [`format.json()`](https://github.com/winstonjs/logform#json) or
     * [`format.prettyPrint()`](https://github.com/winstonjs/logform#prettyprint).
     * This logs all error properties, making it useful with
     * [transports](https://github.com/winstonjs/winston#transports) like
     * [HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport).
     *
     * @example
     * ```js
     * import { createLogger, transports, format } from 'winston'
     *
     * const logger = createLogger({
     *   transports: [new transports.Http(httpOptions)],
     *   format: format.combine(AnyError.fullFormat(), format.json()),
     * })
     *
     * const error = new InputError('Could not read file.', { props: { filePath } })
     * logger.error(error)
     * // Sent via HTTP:
     * // {
     * //   level: 'error',
     * //   name: 'InputError',
     * //   message: 'Could not read file.',
     * //   stack: `InputError: Could not read file.
     * //     at ...`,
     * //   filePath: '/...',
     * // }
     * ```
     */
    fullFormat: (info: Info['staticMethods']) => Format

    /**
     * `AnyError.shortFormat()` can be used
     * [combined](https://github.com/winstonjs/winston#combining-formats) with
     * [`format.simple()`](https://github.com/winstonjs/logform#simple) or
     * [`format.cli()`](https://github.com/winstonjs/logform#cli). This logs
     * only the error name, message and stack, making it useful with
     * [transports](https://github.com/winstonjs/winston#transports) like the
     * [console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).
     *
     * @example
     * ```js
     * const logger = createLogger({
     *   transports: [new transports.Console()],
     *   format: format.combine(AnyError.shortFormat(), format.cli()),
     * })
     *
     * const error = new InputError('Could not read file.', { props: { filePath } })
     * logger.error(error)
     * // error:   InputError: Could not read file.
     * //     at ...
     * ```
     */
    shortFormat: (info: Info['staticMethods']) => Format
  }
}
export default plugin
