import type { Options } from 'handle-cli-error'

import type { Info } from '../main.js'

/**
 * Options of `modern-errors-http`
 */
export type { Options }

/**
 * `modern-errors-cli` plugin
 */
export default plugin
declare const plugin: {
  name: 'cli'
  getOptions: (input: Options) => Options
  staticMethods: {
    exit: (info: Info['staticMethods']) => void
  }
}
