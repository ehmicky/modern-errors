import test from 'ava'
import { each } from 'test-each'
import { LEVEL } from 'triple-beam'

import { TestError, AnyError } from '../../helpers/winston.js'

const { transform } = AnyError.fullFormat()

const knownError = new TestError('test')
const unknownError = new AnyError('test', { cause: '' })
const warnError = new TestError('test', { winston: { level: 'warn' } })
const noStackError = new TestError('test', { winston: { stack: false } })
const yesStackError = new TestError('test', { winston: { stack: true } })

test('Sets level to error by default', (t) => {
  t.is(transform(knownError).level, 'error')
})

test('Can set other level', (t) => {
  t.is(transform(warnError).level, 'warn')
})

each([noStackError, knownError], ({ title }, error) => {
  test(`Does not use the stack if "stack" is false | ${title}`, (t) => {
    t.false('stack' in transform(error))
  })
})

each([yesStackError, unknownError], ({ title }, error) => {
  test(`Use the stack if "stack" is true | ${title}`, (t) => {
    t.is(transform(error).stack, error.stack)
  })
})

test('Default value for "stack" is deep', (t) => {
  const inner = new TestError('inner', { errors: [unknownError] })
  const error = new AnyError('test', { cause: '', errors: [inner] })
  const object = transform(error)
  t.is(object.stack, error.stack)
  t.false('stack' in object.errors[0])
  t.is(object.errors[0].errors[0].stack, error.errors[0].errors[0].stack)
})

test('Normalizes unknown error', (t) => {
  const error = new Error('test')
  t.is(transform(error).name, 'UnknownError')
})

test('Does not include constructorArgs', (t) => {
  t.false('constructorArgs' in transform(warnError))
})

test('Serializes error', (t) => {
  t.deepEqual(transform(knownError), {
    level: 'error',
    [LEVEL]: 'error',
    name: knownError.name,
    message: knownError.message,
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
  const error = new TestError('test', { props: { prop: knownError } })
  t.is(transform(error).prop.message, knownError.message)
})

test('Serializes aggregate errors deeply', (t) => {
  const error = new TestError('test', { errors: [knownError] })
  t.is(transform(error).errors[0].message, error.errors[0].message)
})
