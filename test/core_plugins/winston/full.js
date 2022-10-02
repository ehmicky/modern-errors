import test from 'ava'
import { each } from 'test-each'
import { LEVEL } from 'triple-beam'

import { TestError, AnyError } from '../../helpers/winston.js'

const { transform } = AnyError.fullFormat()

test('Sets level to error by default', (t) => {
  const error = new TestError('test')
  t.is(transform(error).level, 'error')
})

test('Can set other level', (t) => {
  const error = new TestError('test', { winston: { level: 'warn' } })
  t.is(transform(error).level, 'warn')
})

each(
  [new TestError('test', { winston: { stack: false } }), new TestError('test')],
  ({ title }, error) => {
    test(`Does not use the stack if "stack" is false | ${title}`, (t) => {
      t.false('stack' in transform(error))
    })
  },
)

each(
  [
    new TestError('test', { winston: { stack: true } }),
    new AnyError('test', { cause: '' }),
  ],
  ({ title }, error) => {
    test(`Use the stack if "stack" is true | ${title}`, (t) => {
      t.is(transform(error).stack, error.stack)
    })
  },
)

test('Default value for "stack" is deep', (t) => {
  const deepInner = new AnyError('deepInner', { cause: '' })
  const inner = new TestError('inner', { errors: [deepInner] })
  const error = new AnyError('test', { cause: '', errors: [inner] })
  const object = transform(error)
  t.is(object.stack, error.stack)
  t.false('stack' in object.errors[0])
  t.is(object.errors[0].errors[0].stack, deepInner.stack)
})

test('Normalizes unknown error', (t) => {
  const error = new Error('test')
  t.is(transform(error).name, 'UnknownError')
})

test('Does not include constructorArgs', (t) => {
  const error = new TestError('test', { winston: { level: 'warn' } })
  t.false('constructorArgs' in transform(error))
})

test('Serializes error', (t) => {
  const error = new TestError('test')
  t.deepEqual(transform(error), {
    level: 'error',
    [LEVEL]: 'error',
    name: error.name,
    message: error.message,
  })
})

test('Serializes error properties', (t) => {
  const error = new TestError('test', { props: { prop: true } })
  t.true(transform(error).prop)
})

test('Ignore JSON-unsafe error properties', (t) => {
  const error = new TestError('test', { props: { prop: 0n } })
  t.false('prop' in transform(error))
})

test('Serializes error properties deeply', (t) => {
  const prop = new TestError('prop')
  const error = new TestError('test', { props: { prop } })
  t.is(transform(error).prop.message, prop.message)
})

test('Serializes aggregate errors deeply', (t) => {
  const inner = new TestError('prop')
  const error = new TestError('test', { errors: [inner] })
  t.is(transform(error).errors[0].message, inner.message)
})
