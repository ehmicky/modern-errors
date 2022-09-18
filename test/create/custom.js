import test from 'ava'
import { each } from 'test-each'

import {
  defineCustomClass,
  defineClassesOpts,
  defineSimpleClass,
  defineShallowCustom,
  defineSimpleCustom,
  defineDeepCustom,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()
const { ShallowError } = defineShallowCustom()
const { SimpleCustomError } = defineSimpleCustom()
const { DeepCustomError } = defineDeepCustom()

each(
  ['Error', 'TypeError', 'inputError', 'input_error', 'input'],
  ({ title }, errorName) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(defineClassesOpts.bind(undefined, { [errorName]: {} }))
    })
  },
)

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Can define custom classes| ${title}`, (t) => {
    t.true(new ErrorClass('test').prop)
  })
})

each([TestError, ShallowError], ({ title }, ErrorClass) => {
  test(`Parent class is AnyError by default | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass).name, 'AnyError')
  })
})

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Parent class is custom class when passed | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass).name, ErrorClass.name)
  })
})

each(
  [TestError, ShallowError, SimpleCustomError, DeepCustomError],
  ({ title }, ErrorClass) => {
    test(`prototype.name is correct | ${title}`, (t) => {
      t.is(ErrorClass.prototype.name, ErrorClass.name)
      t.false(
        Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'name')
          .enumerable,
      )
      t.is(new ErrorClass('test').name, ErrorClass.name)
    })
  },
)

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
