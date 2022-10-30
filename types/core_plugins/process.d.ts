import logProcessErrors, { Options } from 'log-process-errors'

import type { Info } from '../main.js'

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
