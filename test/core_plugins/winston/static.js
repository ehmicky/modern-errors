import test from 'ava'
import { serialize } from 'error-serializer'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../../src/core_plugins/winston/main.js'
import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

// eslint-disable-next-line fp/no-let
let shortLog = ''
const shortStream = through.obj((object, encoding, done) => {
  // eslint-disable-next-line fp/no-mutation
  shortLog = object[MESSAGE]
  done(undefined, object)
})
const shortLogger = createLogger({
  format: format.combine(AnyError.shortFormat(), format.simple()),
  transports: [new transports.Stream({ stream: shortStream })],
})

// eslint-disable-next-line fp/no-let
let fullLog = {}
const fullStream = through.obj((object, encoding, done) => {
  // eslint-disable-next-line fp/no-mutation
  fullLog = JSON.parse(object[MESSAGE])
  done(undefined, object)
})
const fullLogger = createLogger({
  format: format.combine(AnyError.fullFormat(), format.json()),
  transports: [new transports.Stream({ stream: fullStream })],
})

const testLevel = 'warn'
const defaultLevel = 'error'

test.serial('Can use shortFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  shortLogger.error(error)
  t.is(shortLog, `${testLevel}: ${error.name}: ${error.message}`)
})

test.serial('Can use fullFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  fullLogger.error(error)
  t.deepEqual(fullLog, {
    level: testLevel,
    name: error.name,
    message: error.message,
  })
})

test.serial('Does not modify error', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  const keysBefore = Reflect.ownKeys(error)
  const valuesBefore = serialize(error)

  fullLogger.error(error)

  const keysAfter = Reflect.ownKeys(error)
  const valuesAfter = serialize(error)
  t.deepEqual(keysBefore, keysAfter)
  t.deepEqual(valuesBefore, valuesAfter)
})

test.serial('Can log unknown errors', (t) => {
  const error = new Error('test')
  const { stack } = AnyError.normalize(error)
  shortLogger.error(error)
  t.is(shortLog, `${defaultLevel}: ${stack}`)
})
