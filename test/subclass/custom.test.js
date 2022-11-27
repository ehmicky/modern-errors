import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../helpers/main.js'

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`"custom" option defaults to parent class | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass.subclass('TestError')), ErrorClass)
  })

  test(`"custom" class is inherited | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      custom: class extends ErrorClass {
        prop = true
        static staticProp = true
      },
    })
    t.true(TestError.staticProp)
    t.true(new TestError('test').prop)
  })

  test(`instanceof works with "custom" classes | ${title}`, (t) => {
    const CustomError = ErrorClass.subclass('CustomError', {
      custom: class extends ErrorClass {},
    })
    t.true(new CustomError('test') instanceof ErrorClass)
  })

  test(`Parent class is "custom" class when passed | ${title}`, (t) => {
    const custom = class extends ErrorClass {}
    const CustomError = ErrorClass.subclass('CustomError', { custom })
    t.is(Object.getPrototypeOf(CustomError), custom)
  })

  test(`"custom" option is not modified | ${title}`, (t) => {
    class ReadonlyClass extends ErrorClass {}
    const { name } = ReadonlyClass
    ErrorClass.subclass('CustomError', { custom: ReadonlyClass })
    const { name: newName } = ReadonlyClass
    t.is(newName, name)
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
  ErrorClasses,
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
