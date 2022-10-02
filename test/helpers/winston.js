// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../src/core_plugins/winston/main.js'

import { defineClassOpts } from './main.js'

export const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

export const knownError = new TestError('test')
export const unknownError = new AnyError('test', { cause: '' })
export const warnError = new TestError('test', { winston: { level: 'warn' } })
export const noStackError = new TestError('test', { winston: { stack: false } })
export const yesStackError = new TestError('test', { winston: { stack: true } })
