import test from 'ava'
import { each } from 'test-each'

import {
  defineClassOpts,
  defineSimpleClass,
  defineClassesOpts,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()

each([AnyError, TestError], ({ title }, ParentError) => {
  test(`Parent error cannot be passed as is | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => ParentError.subclass('SelfError', { custom: ParentError }))
  })

  test(`Subclasses must not extend from their parent indirectly | ${title}`, (t) => {
    const IndirectError = ParentError.subclass(`Sub${ParentError.name}`)
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() =>
      ParentError.subclass('SubError', {
        custom: class extends IndirectError {},
      }),
    )
  })

  test(`Subclasses must not extend from siblings | ${title}`, (t) => {
    const SiblingError = ParentError.subclass(`Sibling${ParentError.name}`)
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() =>
      SiblingError.subclass('SubError', { custom: class extends TestError {} }),
    )
  })
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
        return { TestError: { custom } }
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
      return { TestError: { custom } }
    }),
  )
})
