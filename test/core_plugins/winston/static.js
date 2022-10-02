import test from 'ava'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../../src/core_plugins/winston/main.js'
import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

// eslint-disable-next-line fp/no-let
let shortLog = ''
const shortStream = through.obj((object) => {
  // eslint-disable-next-line fp/no-mutation
  shortLog = object[MESSAGE]
})
const shortLogger = createLogger({
  format: format.combine(AnyError.shortFormat(), format.simple()),
  transports: [new transports.Stream({ stream: shortStream })],
})

// eslint-disable-next-line fp/no-let
let fullLog = {}
const fullStream = through.obj((object) => {
  // eslint-disable-next-line fp/no-mutation
  fullLog = JSON.parse(object[MESSAGE])
})
const fullLogger = createLogger({
  format: format.combine(AnyError.fullFormat(), format.json()),
  transports: [new transports.Stream({ stream: fullStream })],
})

const level = 'warn'

test.serial('Can use shortFormat', (t) => {
  const error = new TestError('test', { winston: { level } })
  shortLogger.error(error)
  t.is(shortLog, `${level}: ${error.name}: ${error.message}`)
})

test.serial('Can use fullFormat', (t) => {
  const error = new TestError('test', { winston: { level } })
  fullLogger.error(error)
  t.deepEqual(fullLog, { level, name: error.name, message: error.message })
})
