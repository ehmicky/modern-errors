import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../src/core_plugins/winston/main.js'

import { defineClassOpts } from './main.js'

export const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

export const knownError = new TestError('test')
export const unknownError = new AnyError('test', { cause: '' })
export const warnError = new TestError('test', { winston: { level: 'warn' } })
export const noStackError = new TestError('test', { winston: { stack: false } })
export const yesStackError = new TestError('test', { winston: { stack: true } })

// eslint-disable-next-line fp/no-let
let lastShortLog = ''
const shortStream = through.obj((object, encoding, done) => {
  // eslint-disable-next-line fp/no-mutation
  lastShortLog = object[MESSAGE]
  done(undefined, object)
})
const shortLogger = createLogger({
  format: format.combine(AnyError.shortFormat(), format.simple()),
  transports: [new transports.Stream({ stream: shortStream })],
})

export const shortLog = function (value) {
  shortLogger.error(value)
  return lastShortLog
}

// eslint-disable-next-line fp/no-let
let lastFullLog = {}
const fullStream = through.obj((object, encoding, done) => {
  // eslint-disable-next-line fp/no-mutation
  lastFullLog = JSON.parse(object[MESSAGE])
  done(undefined, object)
})
const fullLogger = createLogger({
  format: format.combine(AnyError.fullFormat(), format.json()),
  transports: [new transports.Stream({ stream: fullStream })],
})

export const fullLog = function (value) {
  fullLogger.error(value)
  return lastFullLog
}
