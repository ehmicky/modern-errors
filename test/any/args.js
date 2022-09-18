import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass, createAnyError } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineSimpleClass()

test('Allows empty options', (t) => {
  t.notThrows(() => new TestError('test'))
})

// eslint-disable-next-line unicorn/no-null
each([null, '', { custom: true }], ({ title }, opts) => {
  test(`Validate against invalid options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', opts))
  })
})

test('Requires Any.create()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() => new TestAnyError('test', { cause: '' }))
})

test('Validate that AnyError has a cause', (t) => {
  t.throws(() => new AnyError('message'))
})

test('AnyError with known cause uses its class', (t) => {
  const cause = new TestError('causeMessage')
  const error = new AnyError('message', { cause })
  t.true(error instanceof Error)
  t.true(error instanceof TestError)
  t.is(Object.getPrototypeOf(error), TestError.prototype)
  t.is(error.name, 'TestError')
})

test('AnyError with unknown cause uses UnknownError', (t) => {
  const cause = new Error('causeMessage')
  const error = new AnyError('message', { cause })
  t.true(error instanceof Error)
  t.true(error instanceof UnknownError)
  t.is(Object.getPrototypeOf(error), UnknownError.prototype)
  t.is(error.name, 'UnknownError')
})

test('AnyError with known cause uses its instance', (t) => {
  const cause = new TestError('causeMessage')
  t.is(new AnyError('message', { cause }), cause)
})

test('AnyError with undefined cause uses UnknownError', (t) => {
  t.is(new AnyError('message', { cause: undefined }).name, 'UnknownError')
})
