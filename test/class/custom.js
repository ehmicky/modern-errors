import test from 'ava'
import { each } from 'test-each'

import {
  defineClassOpts,
  defineSimpleClass,
  defineSimpleCustom,
  defineDeepCustom,
  defineClassesOpts,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()
const { SimpleCustomError } = defineSimpleCustom()
const { DeepCustomError } = defineDeepCustom()

each([AnyError, TestError], ({ title }, ParentError) => {
  test(`Custom option defaults to parent class | ${title}`, (t) => {
    t.is(
      Object.getPrototypeOf(ParentError.class(`Default${ParentError.name}`)),
      ParentError,
    )
  })

  test(`Parent error cannot be passed as is | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => ParentError.class('SelfError', { custom: ParentError }))
  })

  test(`Subclasses must not extend from their parent indirectly | ${title}`, (t) => {
    const IndirectError = ParentError.class(`Sub${ParentError.name}`)
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() =>
      ParentError.class('SubError', { custom: class extends IndirectError {} }),
    )
  })

  test(`Subclasses must not extend from siblings | ${title}`, (t) => {
    const SiblingError = ParentError.class(`Sibling${ParentError.name}`)
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() =>
      SiblingError.class('SubError', { custom: class extends TestError {} }),
    )
  })
})

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Custom classes are inherited | ${title}`, (t) => {
    t.true(ErrorClass.staticProp)
    t.true(new ErrorClass('test').prop)
  })
})

test('Parent class is custom class when passed', (t) => {
  t.is(Object.getPrototypeOf(SimpleCustomError).name, SimpleCustomError.name)
})

class NullClass {}
// eslint-disable-next-line fp/no-mutating-methods, unicorn/no-null
Object.setPrototypeOf(NullClass, null)

each(
  [
    'TestError',
    NullClass,
    Object,
    Function,
    () => {},
    Error,
    TypeError,
    class ChildTypeError extends TypeError {},
    class NoParentError {},
    class InvalidError extends Object {},
    Object.getPrototypeOf(AnyError),
    AnyError,
    TestError,
  ],
  ({ title }, custom) => {
    test(`Validate against invalid "custom" option | ${title}`, (t) => {
      t.throws(defineClassOpts.bind(undefined, { custom }))
    })
  },
)

// eslint-disable-next-line unicorn/no-null
each(['', null], ({ title }, invalidPrototype) => {
  test(`Validate against invalid prototypes | ${title}`, (t) => {
    t.throws(
      // eslint-disable-next-line max-nested-callbacks
      defineClassesOpts.bind(undefined, (TestAnyError) => {
        // eslint-disable-next-line unicorn/consistent-function-scoping, max-nested-callbacks
        const custom = function () {}
        // eslint-disable-next-line fp/no-mutation
        custom.prototype = invalidPrototype
        // eslint-disable-next-line fp/no-mutating-methods
        Object.setPrototypeOf(custom, TestAnyError)
        return { InputError: { custom } }
      }),
    )
  })
})

test('Validate against invalid constructor', (t) => {
  t.throws(
    defineClassesOpts.bind(undefined, (TestAnyError) => {
      class custom extends TestAnyError {}
      // eslint-disable-next-line fp/no-mutation
      custom.prototype.constructor = Error
      return { InputError: { custom } }
    }),
  )
})

test('"custom" option is not modified', (t) => {
  const { InputError } = defineClassesOpts((TestAnyError) => ({
    InputError: {
      custom: class ReadonlyClass extends TestAnyError {},
    },
  }))
  t.is(Object.getPrototypeOf(InputError).name, 'ReadonlyClass')
})

test('"custom" option can be shared', (t) => {
  const { TwoError } = defineClassesOpts((TestAnyError) => {
    class Parent extends TestAnyError {}
    return { OneError: { custom: Parent }, TwoError: { custom: Parent } }
  })
  t.is(Object.getPrototypeOf(TwoError).name, 'Parent')
})
