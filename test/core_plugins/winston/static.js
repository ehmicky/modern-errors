import test from 'ava'
import { serialize } from 'error-serializer'
import { each } from 'test-each'
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

test.serial('Log known errors with shortFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  shortLogger.error(error)
  t.is(shortLog, `${testLevel}: ${error.name}: ${error.message}`)
})

test.serial('Log known errors with fullFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  fullLogger.error(error)
  t.deepEqual(fullLog, {
    level: testLevel,
    name: error.name,
    message: error.message,
  })
})

test.serial('Log unknown errors with shortFormat', (t) => {
  const error = new Error('test')
  const { stack } = AnyError.normalize(error)
  shortLogger.error(error)
  t.is(shortLog, `${defaultLevel}: ${stack}`)
})

test.serial('Log unknown errors with fullFormat', (t) => {
  const error = new Error('test')
  const { name, message, stack } = AnyError.normalize(error)
  fullLogger.error(error)
  t.deepEqual(fullLog, { level: defaultLevel, name, message, stack })
})

test.serial('Log non-errors with shortFormat', (t) => {
  const message = 'test'
  shortLogger.error(message)
  t.is(shortLog, `${defaultLevel}: ${message}`)
})

test.serial('Log non-errors with fullFormat', (t) => {
  const message = 'test'
  fullLogger.error(message)
  t.deepEqual(fullLog, { level: defaultLevel, message })
})

each([shortLogger, fullLogger], ({ title }, logger) => {
  test.serial(`Does not modify error | ${title}`, (t) => {
    const error = new TestError('test', { winston: { level: testLevel } })
    const keysBefore = Reflect.ownKeys(error)
    const valuesBefore = serialize(error)

    logger.error(error)

    const keysAfter = Reflect.ownKeys(error)
    const valuesAfter = serialize(error)
    t.deepEqual(keysBefore, keysAfter)
    t.deepEqual(valuesBefore, valuesAfter)
  })
})
