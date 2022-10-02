import { runInNewContext } from 'vm'

import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, createAnyError } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()

test('Allows empty options', (t) => {
  t.notThrows(() => new TestError('test'))
})

each([null, '', { custom: true }], ({ title }, opts) => {
  test(`Validate against invalid options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', opts))
  })
})

test('Requires AnyError.subclass()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() => new TestAnyError('test', { cause: '' }))
})

test('Validate that AnyError has a cause', (t) => {
  t.throws(() => new AnyError('message'))
})

test('Validate that AnyError has 2 arguments', (t) => {
  const cause = new TestError('causeMessage')
  t.throws(() => new AnyError('message', { cause }, true))
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

each([TypeError, runInNewContext('TypeError')], ({ title }, ErrorClass) => {
  test(`AnyError with unknown cause keeps error name if present | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    t.is(new AnyError('', { cause }).message, `TypeError: causeMessage`)
  })
})

each(
  [
    'causeMessage',
    // eslint-disable-next-line fp/no-mutating-assign
    Object.assign(new TypeError('causeMessage'), { name: true }),
    new Error('causeMessage'),
  ],
  ({ title }, cause) => {
    test(`AnyError with unknown cause does not keep error name if absent | ${title}`, (t) => {
      t.is(new AnyError('', { cause }).message, 'causeMessage')
    })
  },
)

test('AnyError with known cause uses its instance', (t) => {
  const cause = new TestError('causeMessage')
  t.is(new AnyError('message', { cause }), cause)
})

test('AnyError with undefined cause uses UnknownError', (t) => {
  t.is(new AnyError('message', { cause: undefined }).name, 'UnknownError')
})
