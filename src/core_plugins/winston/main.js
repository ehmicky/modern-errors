import { toFullLogObject } from './full.js'
import { getOptions } from './options.js'
import { toShortLogObject } from './short.js'
import { shortFormat, fullFormat } from './static.js'

// eslint-disable-next-line import/no-default-export
export default {
  name: 'winston',
  getOptions,
  instanceMethods: { toShortLogObject, toFullLogObject },
  staticMethods: { shortFormat, fullFormat },
}
