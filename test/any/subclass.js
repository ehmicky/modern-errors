import test from 'ava'

import { defineSimpleClass } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineSimpleClass()

test('Cannot extend from AnyError without AnyError.class()', (t) => {
  class ChildError extends AnyError {}
  t.throws(() => new ChildError('test'))
})

test('Cannot extend from known classes without AnyError.class()', (t) => {
  class ChildError extends TestError {}
  t.throws(() => new ChildError('test'))
})

test('Can extend from known classes with AnyError.class()', (t) => {
  class ChildError extends TestError {}
  const KnownError = AnyError.class('KnownError', { custom: ChildError })
  t.is(new KnownError('test').name, 'KnownError')
})

test('Can extend from UnknownError', (t) => {
  class ChildUnknownError extends UnknownError {}
  const ChildKnownError = AnyError.class('ChildUnknownError', {
    custom: ChildUnknownError,
  })
  t.is(new ChildKnownError('test').name, 'ChildUnknownError')
})
