import test from 'ava'
import { each } from 'test-each'

import { defineClassesOpts, createAnyError } from '../helpers/main.js'

const AnyError = createAnyError()
const InputError = AnyError.class('InputError')

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
  const OtherInputError = TestAnyError.class('OtherInputError')
  TestAnyError.class('UnknownError')
  t.notThrows(() => new OtherInputError('test'))
})

test('Can use "custom" with UnknownError', (t) => {
  const TestAnyError = createAnyError()
  const UnknownError = TestAnyError.class('UnknownError', {
    custom: class extends TestAnyError {
      static prop = true
    },
  })
  t.true(UnknownError.prop)
})

test('Require defining at least one error', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() => new TestAnyError('', { cause: '' }))
})

each(
  [
    () => ({ error: {} }),
    () => ({ error: new Error('test') }),
    () => {
      throw new Error('unsafe')
    },
    (message, { cause = new Error('') } = {}) => {
      cause.stack.trim()
      return {}
    },
    (message, { cause = {} } = {}) => {
      // eslint-disable-next-line no-unused-expressions
      cause.stack
      return {}
    },
    (message) => ({ args: [message] }),
  ],
  ({ title }, custom) => {
    test(`Validate UnknownError constructor | ${title}`, (t) => {
      t.throws(
        // eslint-disable-next-line max-nested-callbacks
        defineClassesOpts.bind(undefined, (TestAnyError) => ({
          UnknownError: {
            custom: class extends TestAnyError {
              // eslint-disable-next-line max-nested-callbacks
              constructor(...args) {
                const { error, args: argsA = args } = custom(...args)
                super(...argsA)
                // eslint-disable-next-line no-constructor-return
                return error
              }
            },
          },
        })),
      )
    })
  },
)
