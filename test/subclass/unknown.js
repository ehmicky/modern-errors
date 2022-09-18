import test from 'ava'

import { createAnyError } from '../helpers/main.js'

const AnyError = createAnyError()
const InputError = AnyError.subclass('InputError')

test('Require defining UnknownError before creating errors', (t) => {
  t.throws(() => new InputError('test'))
})

test('Require defining UnknownError before AnyError.normalize()', (t) => {
  t.throws(AnyError.normalize)
})

test('Require defining UnknownError before plugin static methods', (t) => {
  t.throws(AnyError.getProp)
})

test('Allow defining UnknownError at the end', (t) => {
  const TestAnyError = createAnyError()
  const OtherInputError = TestAnyError.subclass('OtherInputError')
  TestAnyError.subclass('UnknownError')
  t.notThrows(() => new OtherInputError('test'))
})

test('Cannot use "custom" with UnknownError', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() =>
    TestAnyError.subclass('UnknownError', {
      custom: class extends TestAnyError {},
    }),
  )
})

test('Require defining at least one error', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() => new TestAnyError('', { cause: '' }))
})
