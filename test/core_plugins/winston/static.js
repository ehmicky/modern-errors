import test from 'ava'
import { serialize } from 'error-serializer'
import { each } from 'test-each'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

import { TestError, AnyError } from '../../helpers/winston.js'

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

const doShortLog = function (value) {
  shortLogger.error(value)
  return shortLog
}

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

const doFullLog = function (value) {
  fullLogger.error(value)
  return fullLog
}

const testLevel = 'warn'
const defaultLevel = 'error'

test.serial('Log known errors with shortFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  t.is(doShortLog(error), `${testLevel}: ${error.name}: ${error.message}`)
})

test.serial('Log known errors with fullFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  t.deepEqual(doFullLog(error), {
    level: testLevel,
    name: error.name,
    message: error.message,
  })
})

test.serial('Log unknown errors with shortFormat', (t) => {
  const error = new Error('test')
  const { stack } = AnyError.normalize(error)
  t.is(doShortLog(error), `${defaultLevel}: ${stack}`)
})

test.serial('Log unknown errors with fullFormat', (t) => {
  const error = new Error('test')
  const { name, message, stack } = AnyError.normalize(error)
  t.deepEqual(doFullLog(error), { level: defaultLevel, name, message, stack })
})

test.serial('Log non-errors with shortFormat', (t) => {
  const message = 'test'
  t.is(doShortLog(message), `${defaultLevel}: ${message}`)
})

test.serial('Log non-errors with fullFormat', (t) => {
  const message = 'test'
  t.deepEqual(doFullLog(message), { level: defaultLevel, message })
})

each([doShortLog, doFullLog], ({ title }, doLog) => {
  test.serial(`Does not modify error | ${title}`, (t) => {
    const error = new TestError('test', { winston: { level: testLevel } })
    const keysBefore = Reflect.ownKeys(error)
    const valuesBefore = serialize(error)

    doLog(error)

    const keysAfter = Reflect.ownKeys(error)
    const valuesAfter = serialize(error)
    t.deepEqual(keysBefore, keysAfter)
    t.deepEqual(valuesBefore, valuesAfter)
  })
})
