import test from 'ava'
import { setErrorName } from 'error-class-utils'

import { defineSimpleClass } from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()

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

test('AnyError cannot be subclassed', (t) => {
  class ChildAnyError extends AnyError {}
  setErrorName(ChildAnyError, 'ChildAnyError')
  t.throws(() => new ChildAnyError('test', { cause: '' }))
})
