import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'

const { ErrorClasses } = getClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Parent error cannot be passed as is | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'SelfError', { custom: ErrorClass }),
    )
  })

  test(`Subclasses must not extend from their parent indirectly | ${title}`, (t) => {
    const IndirectError = ErrorClass.subclass('IndirectError')
    t.throws(
      ErrorClass.subclass.bind(undefined, 'SubError', {
        custom: class extends IndirectError {},
      }),
    )
  })

  test(`Subclasses must not extend from siblings | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const SiblingError = ErrorClass.subclass('SiblingError')
    t.throws(
      TestError.subclass.bind(undefined, 'SubError', {
        custom: class extends SiblingError {},
      }),
    )
  })

  test(`Validate against invalid constructor | ${title}`, (t) => {
    class custom extends ErrorClass {}
    // eslint-disable-next-line fp/no-mutation
    custom.prototype.constructor = Error
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { custom }))
  })
})

class NullClass {}
// eslint-disable-next-line fp/no-mutating-methods
Object.setPrototypeOf(NullClass, null)

each(
  ErrorClasses,
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
  ],
  ({ title }, ErrorClass, custom) => {
    test(`Validate against invalid "custom" option | ${title}`, (t) => {
      t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { custom }))
    })
  },
)

each(ErrorClasses, ['', null], ({ title }, ErrorClass, invalidPrototype) => {
  test(`Validate against invalid prototypes | ${title}`, (t) => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const custom = function () {}
    // eslint-disable-next-line fp/no-mutation
    custom.prototype = invalidPrototype
    // eslint-disable-next-line fp/no-mutating-methods
    Object.setPrototypeOf(custom, ErrorClass)
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { custom }))
  })
})
