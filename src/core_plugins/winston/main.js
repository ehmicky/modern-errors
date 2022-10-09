import { getOptions } from './options.js'
import { shortFormat, fullFormat } from './static.js'

// eslint-disable-next-line import/no-default-export
export default {
  name: 'winston',
  getOptions,
  staticMethods: { shortFormat, fullFormat },
}
