import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'

const { KnownErrorClasses } = getClasses()

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`Custom option defaults to parent class | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass.subclass('TestError')), ErrorClass)
  })

  test(`Custom classes are inherited | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      custom: class extends ErrorClass {
        prop = true
        static staticProp = true
      },
    })
    t.true(TestError.staticProp)
    t.true(new TestError('test').prop)
  })

  test(`instanceof works with custom classes | ${title}`, (t) => {
    const CustomError = ErrorClass.subclass('CustomError', {
      custom: class extends ErrorClass {},
    })
    t.true(new CustomError('test') instanceof ErrorClass)
  })

  test(`Parent class is custom class when passed | ${title}`, (t) => {
    const custom = class extends ErrorClass {}
    const CustomError = ErrorClass.subclass('CustomError', { custom })
    t.is(Object.getPrototypeOf(CustomError), custom)
  })

  test(`"custom" option is not modified | ${title}`, (t) => {
    class ReadonlyClass extends ErrorClass {}
    t.is(ReadonlyClass.name, 'ReadonlyClass')
    ErrorClass.subclass('CustomError', { custom: ReadonlyClass })
    t.is(ReadonlyClass.name, 'ReadonlyClass')
  })

  test(`"custom" option can be shared | ${title}`, (t) => {
    class SharedError extends ErrorClass {
      static prop = true
    }
    t.true(ErrorClass.subclass('OneError', { custom: SharedError }).prop)
    t.true(ErrorClass.subclass('TwoError', { custom: SharedError }).prop)
  })
})

each(
  KnownErrorClasses,
  ['message', 'properties', 'getInstance'],
  ({ title }, ErrorClass, propName) => {
    test(`"custom" option can override other properties | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', {
        custom: class extends ErrorClass {
          constructor(message, options) {
            super(message, options)
            // eslint-disable-next-line fp/no-this, fp/no-mutation
            this[propName] = true
          }
        },
      })
      t.true(new TestError('test')[propName])
    })
  },
)
