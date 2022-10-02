import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  AnyError,
  defaultLevel,
  testLevel,
  knownError,
  unknownError,
  warnError,
  noStackError,
  yesStackError,
} from '../../helpers/winston.js'

const { transform } = AnyError.shortFormat()

test('Sets level to error by default', (t) => {
  t.is(transform(knownError).level, defaultLevel)
})

test('Can set other level', (t) => {
  t.is(transform(warnError).level, testLevel)
})

each([noStackError, knownError], ({ title }, error) => {
  test(`Does not use the stack if "stack" is false | ${title}`, (t) => {
    t.is(transform(error).message, `${error.name}: ${error.message}`)
  })
})

each([yesStackError, unknownError], ({ title }, error) => {
  test(`Use the stack if "stack" is true | ${title}`, (t) => {
    t.is(transform(error).message, error.stack)
  })
})

each(['name', 'message'], ({ title }, propName) => {
  test(`Use the prepended stack if "stack" is true and it misses the name or message | ${title}`, (t) => {
    const error = new TestError('message', { winston: { stack: true } })
    // TODO: use string.replaceAll() after dropping support for Node <15.0.0
    error.stack = error.stack.replace(new RegExp(error[propName], 'gu'), '')
    t.is(
      transform(error).message,
      `${error.name}: ${error.message}\n${error.stack}`,
    )
  })
})
