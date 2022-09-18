import test from 'ava'

import { createAnyError } from '../helpers/main.js'

const AnyError = createAnyError()

test('Require defining UnknownError before creating errors', (t) => {
  t.throws(AnyError.subclass.bind(undefined, 'InputError'))
})

test('Require defining UnknownError before AnyError.normalize()', (t) => {
  t.throws(AnyError.normalize)
})

test('Require defining UnknownError before plugin static methods', (t) => {
  t.throws(AnyError.getProp)
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
