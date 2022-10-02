import test from 'ava'
import { serialize } from 'error-serializer'
import { each } from 'test-each'

import {
  TestError,
  AnyError,
  shortLog,
  fullLog,
} from '../../helpers/winston.js'

const testLevel = 'warn'
const defaultLevel = 'error'

test.serial('Log known errors with shortFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  t.is(shortLog(error), `${testLevel}: ${error.name}: ${error.message}`)
})

test.serial('Log known errors with fullFormat', (t) => {
  const error = new TestError('test', { winston: { level: testLevel } })
  t.deepEqual(fullLog(error), {
    level: testLevel,
    name: error.name,
    message: error.message,
  })
})

test.serial('Log unknown errors with shortFormat', (t) => {
  const error = new Error('test')
  const { stack } = AnyError.normalize(error)
  t.is(shortLog(error), `${defaultLevel}: ${stack}`)
})

test.serial('Log unknown errors with fullFormat', (t) => {
  const error = new Error('test')
  const { name, message, stack } = AnyError.normalize(error)
  t.deepEqual(fullLog(error), { level: defaultLevel, name, message, stack })
})

test.serial('Log non-errors with shortFormat', (t) => {
  const message = 'test'
  t.is(shortLog(message), `${defaultLevel}: ${message}`)
})

test.serial('Log non-errors with fullFormat', (t) => {
  const message = 'test'
  t.deepEqual(fullLog(message), { level: defaultLevel, message })
})

each([shortLog, fullLog], ({ title }, doLog) => {
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
