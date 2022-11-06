import test from 'ava'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

test('instanceof AnyError can be used with root errors', (t) => {
  t.true(new AnyError('test') instanceof AnyError)
})

test('instanceof AnyError can be used with child errors', (t) => {
  t.true(new TestError('test') instanceof AnyError)
})

test('instanceof AnyError can be used with other errors', (t) => {
  t.false(new Error('test') instanceof AnyError)
})

test('instanceof AnyError prevents naming collisions', (t) => {
  const { AnyError: OtherAnyError } = defineClassOpts()
  t.false(new OtherAnyError('test') instanceof AnyError)
})

test('AnyError.prototype.name is correct', (t) => {
  t.is(AnyError.prototype.name, 'AnyError')
  t.false(
    Object.getOwnPropertyDescriptor(AnyError.prototype, 'name').enumerable,
  )
})
