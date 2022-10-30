import type { Options } from 'handle-cli-error'

import type { Info } from '../main.js'

/**
 * Options of `modern-errors-http`
 */
export type { Options }

/**
 * `modern-errors-cli` plugin
 */
declare const plugin: {
  name: 'cli'
  getOptions: (input: Options) => Options
  staticMethods: {
    /**
     * Logs `error` on the console (`stderr`) then exits the process.
     *
     * This never throws. Invalid errors are silently
     * [normalized](https://github.com/ehmicky/normalize-exception).
     *
     * @example
     * ```js
     * const cliMain = function () {
     *   try {
     *     // ...
     *   } catch (error) {
     *     const normalizedError = AnyError.normalize(error)
     *     normalizedError.exit()
     *   }
     * }
     *
     * cliMain()
     * ```
     */
    exit: (info: Info['staticMethods']) => void
  }
}
export default plugin
