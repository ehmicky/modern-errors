import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

test('error.errors can be set', (t) => {
  t.deepEqual(new TestError('test', { errors: [] }).errors, [])
})

test('error.errors is not set by default', (t) => {
  t.is(new TestError('test').errors, undefined)
})

test('error.errors is validated', (t) => {
  t.throws(() => new TestError('test', { errors: true }))
})

test('error.errors is not enumerable', (t) => {
  t.false(
    Object.getOwnPropertyDescriptor(
      new TestError('test', { errors: [] }),
      'errors',
    ).enumerable,
  )
})

test('error.errors are normalized', (t) => {
  t.true(
    new TestError('test', { errors: [true] }).errors[0] instanceof AnyError,
  )
})

each([TestError, AnyError], ({ title }, ErrorClass) => {
  test(`error.errors are appended to | ${title}`, (t) => {
    const one = new TestError('one')
    const two = new TestError('two')
    const cause = new TestError('causeMessage', { errors: [one] })
    const error = new ErrorClass('message', { cause, errors: [two] })
    t.deepEqual(error.errors, [one, two])
  })
})
