import logProcessErrors, { Options, Event } from 'log-process-errors'

import type { Info } from '../main.js'

export type { Event }

/**
 * Options of `modern-errors-process`
 */
export type { Options }

/**
 * `modern-errors-process` plugin
 */
export default plugin
declare const plugin: {
  name: 'process'
  getOptions: (input: Options) => Options
  staticMethods: {
    logProcess: (
      info: Info['staticMethods'],
    ) => ReturnType<typeof logProcessErrors>
  }
}
