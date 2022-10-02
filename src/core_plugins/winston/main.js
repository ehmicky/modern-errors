import { toFullLogObject, getFullLogOmittedProps } from './full.js'
import { isOptions, getOptions } from './options.js'
import { toShortLogObject } from './short.js'
import { shortFormat, fullFormat } from './static.js'

// eslint-disable-next-line import/no-default-export
export default {
  name: 'winston',
  isOptions,
  getOptions,
  instanceMethods: {
    toShortLogObject,
    toFullLogObject,
    getFullLogOmittedProps,
  },
  staticMethods: { shortFormat, fullFormat },
}
