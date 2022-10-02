// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../src/core_plugins/winston/main.js'

import { defineClassOpts } from './main.js'

export const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])
