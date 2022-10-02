import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import WINSTON_PLUGIN from '../../../src/core_plugins/winston/main.js'
import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError } = defineClassOpts({}, {}, [WINSTON_PLUGIN])

test('Sets level to error by default', (t) => {
  const error = new TestError('test')
  t.is(AnyError.shortFormat().transform(error).level, 'error')
})

test('Can set other level', (t) => {
  const error = new TestError('test', { winston: { level: 'warn' } })
  t.is(AnyError.shortFormat().transform(error).level, 'warn')
})

test('Does not use the stack if "stack" is false', (t) => {
  const error = new TestError('test', { winston: { stack: false } })
  t.is(
    AnyError.shortFormat().transform(error).message,
    `${error.name}: ${error.message}`,
  )
})

test('Does not use the stack if the error is not deeply unknown', (t) => {
  const error = new TestError('test')
  t.is(
    AnyError.shortFormat().transform(error).message,
    `${error.name}: ${error.message}`,
  )
})

test('Use the stack if "stack" is true', (t) => {
  const error = new TestError('test', { winston: { stack: true } })
  t.is(AnyError.shortFormat().transform(error).message, error.stack)
})

test('Use the stack if the error is deeply unknown', (t) => {
  const error = new AnyError('test', { cause: '' })
  t.is(AnyError.shortFormat().transform(error).message, error.stack)
})

each(['name', 'message'], ({ title }, propName) => {
  test(`Use the prepended stack if "stack" is true and it misses the name or message | ${title}`, (t) => {
    const error = new TestError('message', { winston: { stack: true } })
    error.stack = error.stack.replace(error[propName], '')
    t.is(
      AnyError.shortFormat().transform(error).message,
      `${error.name}: ${error.message}\n${error.stack}`,
    )
  })
})
