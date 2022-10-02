import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts()

each(['prop', Symbol('prop')], ({ title }, key) => {
  test(`plugin.set() properties are reverted | ${title}`, (t) => {
    const cause = new TestError('test', { prop: { toSet: { [key]: true } } })
    t.true(cause[key])
    t.false(key in new TestError('test', { cause }))
  })
})

test('plugin.set() deletions are reverted', (t) => {
  const error = new TestError('test')
  error.deletedProp = true
  const cause = new TestError('test', {
    cause: error,
    prop: { toSet: { deletedProp: undefined } },
  })
  t.false('deletedProp' in cause)
  const newError = new TestError('test', { cause })
  t.true(newError.deletedProp)
})

const causeMessage = 'causeMessage'
const message = 'exampleMessage'

test('plugin.set() message are reverted', (t) => {
  const cause = new TestError(causeMessage)
  t.is(cause.message, causeMessage)
  t.true(cause.stack.includes(causeMessage))

  const error = new TestError('', { cause, prop: { toSet: { message } } })
  t.is(error.message, message)
  t.true(error.stack.includes(message))

  const newError = new TestError('', { cause: error })
  t.is(newError.message, causeMessage)
  // eslint-disable-next-line ava/max-asserts
  t.true(newError.stack.includes(causeMessage))
})

test('plugin.set() properties reverts cannot be mutated', (t) => {
  const deepCause = new TestError('deepCauseMessage')
  const props = { two: true }
  // eslint-disable-next-line fp/no-mutation
  deepCause.one = props
  const cause = new TestError('causeMessage', {
    cause: deepCause,
    prop: { toSet: { one: true } },
  })
  // eslint-disable-next-line fp/no-mutation
  props.two = false
  const error = new TestError('test', { cause })
  t.true(error.one.two)
})

test('plugin.set() values that have noop changes are not reverted', (t) => {
  const deepCause = new TestError('deepCauseMessage')
  // eslint-disable-next-line fp/no-mutation
  deepCause.one = true
  const cause = new TestError('causeMessage', {
    cause: deepCause,
    prop: { toSet: { one: true } },
  })
  // eslint-disable-next-line fp/no-mutation
  cause.one = false
  const error = new TestError('test', { cause })
  t.false(error.one)
})

test('plugin.set() values that have noop deletions are not reverted', (t) => {
  const cause = new TestError('causeMessage', {
    prop: { toSet: { one: undefined } },
  })
  // eslint-disable-next-line fp/no-mutation
  cause.one = false
  const error = new TestError('test', { cause })
  t.false(error.one)
})

test('plugin.set() change reverts are temporary without AnyError', (t) => {
  const cause = new TestError('test', { prop: { toSet: { one: true } } })
  // eslint-disable-next-line no-new
  new TestError('test', { cause })
  t.true(cause.one)
})

test('plugin.set() deletions reverts are temporary without AnyError', (t) => {
  const deepCause = new TestError('test')
  // eslint-disable-next-line fp/no-mutation
  deepCause.one = true
  const cause = new TestError('test', { prop: { toSet: { one: undefined } } })
  // eslint-disable-next-line no-new
  new TestError('test', { cause })
  t.false('one' in cause)
})
