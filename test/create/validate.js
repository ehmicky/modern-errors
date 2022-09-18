import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass, defineCustomClass } from '../helpers/main.js'

const { AnyError } = defineSimpleClass()

each(
  [
    'UnknownError',
    Object,
    Function,
    () => {},
    Error,
    TypeError,
    class ChildTypeError extends TypeError {},
    class NoParentError {},
    class InvalidError extends Object {},
  ],
  ({ title }, custom) => {
    test(`Validate against invalid parents | ${title}`, (t) => {
      t.throws(defineCustomClass.bind(undefined, custom))
    })
  },
)

test('Cannot pass AnyError', (t) => {
  t.throws(() => defineCustomClass(AnyError))
})

test('Cannot pass CoreError', (t) => {
  const CoreError = Object.getPrototypeOf(AnyError)
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
