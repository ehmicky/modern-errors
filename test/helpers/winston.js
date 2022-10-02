import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../src/core_plugins/winston/main.js'

import { defineClassOpts } from './main.js'

export const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

export const defaultLevel = 'error'
export const testLevel = 'warn'

export const knownError = new TestError('test')
export const unknownError = new AnyError('test', { cause: '' })
export const warnError = new TestError('test', {
  winston: { level: testLevel },
})
export const noStackError = new TestError('test', { winston: { stack: false } })
export const yesStackError = new TestError('test', { winston: { stack: true } })

export const shortLog = function (value) {
  shortLogger.error(value)
  return lastShortLog
}

// eslint-disable-next-line fp/no-let
let lastShortLog = ''

const getShortLogger = function () {
  const shortStream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastShortLog = object[MESSAGE]
    done(undefined, object)
  })
  return createLogger({
    format: format.combine(AnyError.shortFormat(), format.simple()),
    transports: [new transports.Stream({ stream: shortStream })],
  })
}

const shortLogger = getShortLogger()

export const fullLog = function (value) {
  fullLogger.error(value)
  return lastFullLog
}

// eslint-disable-next-line fp/no-let
let lastFullLog = {}

const getFullLogger = function () {
  const fullStream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastFullLog = JSON.parse(object[MESSAGE])
    done(undefined, object)
  })
  return createLogger({
    format: format.combine(AnyError.fullFormat(), format.json()),
    transports: [new transports.Stream({ stream: fullStream })],
  })
}

const fullLogger = getFullLogger()
