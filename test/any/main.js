import test from 'ava'
import { setErrorName } from 'error-class-utils'

import { defineSimpleClass } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineSimpleClass()

test('instanceof AnyError can be used with known errors', (t) => {
  t.true(new TestError('test') instanceof AnyError)
})

test('instanceof AnyError can be used with unknown errors', (t) => {
  t.true(new AnyError('test', { cause: '' }) instanceof AnyError)
})

test('instanceof AnyError can be used with other errors', (t) => {
  t.false(new Error('test') instanceof AnyError)
})

test('instanceof AnyError prevents naming collisions', (t) => {
  // eslint-disable-next-line no-shadow
  class TestError extends Error {}
  setErrorName(TestError, 'TestError')
  t.false(new TestError('test') instanceof AnyError)
})

test('AnyError.prototype.name is correct', (t) => {
  t.is(AnyError.prototype.name, 'AnyError')
  t.false(
    Object.getOwnPropertyDescriptor(AnyError.prototype, 'name').enumerable,
  )
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

test('AnyError with known cause uses its instance', (t) => {
  const cause = new TestError('causeMessage')
  t.is(new AnyError('message', { cause }), cause)
})

test('AnyError with unknown cause uses UnknownError', (t) => {
  const cause = new Error('causeMessage')
  const error = new AnyError('message', { cause })
  t.true(error instanceof Error)
  t.true(error instanceof UnknownError)
  t.is(Object.getPrototypeOf(error), UnknownError.prototype)
  t.is(error.name, 'UnknownError')
})

test('AnyError with undefined cause uses UnknownError', (t) => {
  const outerMessage = 'message'
  const error = new AnyError(outerMessage, { cause: undefined })
  t.is(error.name, 'UnknownError')
})

test('AnyError cannot be subclassed', (t) => {
  class ChildAnyError extends AnyError {}
  setErrorName(ChildAnyError, 'ChildAnyError')
  t.throws(() => new ChildAnyError('test', { cause: '' }))
})
