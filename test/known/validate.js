import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass, defineCustomClass } from '../helpers/main.js'

const { TestError } = defineSimpleClass()

each(
  [
    'UnknownError',
    Object,
    Function,
    () => {},
    Error,
    TypeError,
    class NotBaseTypeError extends TypeError {},
    class NoParentError {},
    class InvalidError extends Object {},
  ],
  ({ title }, custom) => {
    test(`Validate against invalid parents | ${title}`, (t) => {
      t.throws(defineCustomClass.bind(undefined, custom))
    })
  },
)

test('Cannot pass twice the same classes', (t) => {
  t.throws(() => defineCustomClass(TestError))
})

test('Cannot pass BaseError', (t) => {
  const BaseError = Object.getPrototypeOf(TestError)
  t.throws(() => defineCustomClass(BaseError))
})

test('Cannot pass CoreError', (t) => {
  const CoreError = Object.getPrototypeOf(Object.getPrototypeOf(TestError))
  t.throws(() => defineCustomClass(CoreError))
})

// eslint-disable-next-line unicorn/no-null
each(['', null], ({ title }, invalidPrototype) => {
  test(`Validate against invalid prototypes | ${title}`, (t) => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const custom = function () {}
    // eslint-disable-next-line fp/no-mutation
    custom.prototype = invalidPrototype
    // eslint-disable-next-line fp/no-mutating-methods
    Object.setPrototypeOf(custom, Error)
    t.throws(defineCustomClass.bind(undefined, custom))
  })
})

test('Validate against invalid constructor', (t) => {
  class custom extends Error {}
  // eslint-disable-next-line fp/no-mutation
  custom.prototype.constructor = Error
  t.throws(defineCustomClass.bind(undefined, custom))
})

test('Validate against parent being null', (t) => {
  class custom extends Error {}
  // eslint-disable-next-line fp/no-mutating-methods, unicorn/no-null
  Object.setPrototypeOf(custom, null)
  t.throws(defineCustomClass.bind(undefined, custom))
})
