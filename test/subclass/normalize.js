import test from 'ava'
import { each } from 'test-each'

import { getClasses, ModernError } from '../helpers/main.js'
import { getUnknownErrors } from '../helpers/unknown.js'

const { ErrorClasses, ErrorSubclasses } = getClasses()

each([null, '', Function, Object, Error], ({ title }, invalidErrorClass) => {
  test(`ErrorClass.normalize() normalizes unknown errors | ${title}`, (t) => {
    t.throws(ModernError.normalize.bind(undefined, '', invalidErrorClass))
  })
})

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`ErrorClass.normalize() normalizes unknown errors | ${title}`, (t) => {
    t.true(ErrorClass.normalize() instanceof Error)
  })

  test(`ErrorClass.normalize() normalizes known errors | ${title}`, (t) => {
    const error = new ErrorClass('test')
    const { name } = error
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, 'name', {
      value: name,
      enumerable: true,
      writable: true,
      configurable: true,
    })
    error.message = true
    const normalizedError = ErrorClass.normalize(error)
    t.is(normalizedError.name, name)
    t.false(Object.getOwnPropertyDescriptor(error, 'name').enumerable)
    t.is(normalizedError.message, '')
  })

  test(`ErrorClass.normalize() changes error class if superclass | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const error = new ErrorClass('test')
    t.true(TestError.normalize(error) instanceof TestError)
  })

  test(`ErrorClass.normalize(error, TestError) changes error class if superclass | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const SubTestError = TestError.subclass('SubTestError')
    const error = new ErrorClass('test')
    t.true(TestError.normalize(error, SubTestError) instanceof SubTestError)
  })

  test(`ErrorClass.normalize() keeps error class if same class | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.true(ErrorClass.normalize(error) instanceof ErrorClass)
  })

  test(`ErrorClass.normalize(error, TestError) keeps error class if same class | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const error = new ErrorClass('test')
    t.true(ErrorClass.normalize(error, TestError) instanceof TestError)
  })

  test(`ErrorClass.normalize() keeps error class if subclass | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const error = new TestError('test')
    t.true(ErrorClass.normalize(error) instanceof TestError)
  })

  test(`ErrorClass.normalize() context is bound | ${title}`, (t) => {
    const { normalize } = ErrorClass
    t.true(normalize() instanceof Error)
  })
})

each(
  ErrorClasses,
  getUnknownErrors(),
  ({ title }, ErrorClass, getUnknownError) => {
    test(`ErrorClass.normalize() changes error class if unknown | ${title}`, (t) => {
      t.true(ErrorClass.normalize(getUnknownError()) instanceof ErrorClass)
    })

    test(`ErrorClass.normalize(error, TestError) changes error class if unknown | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError')
      t.true(
        ErrorClass.normalize(getUnknownError(), TestError) instanceof TestError,
      )
    })
  },
)

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`ErrorClass.normalize() second argument must be a subclass | ${title}`, (t) => {
    const TestError = ModernError.subclass('TestError')
    t.throws(ErrorClass.normalize.bind(undefined, '', TestError))
  })

  test(`ErrorClass.normalize() prevents naming collisions | ${title}`, (t) => {
    const OtherError = ModernError.subclass(ErrorClass.name)
    const error = new OtherError('test')
    t.true(ErrorClass.normalize(error) instanceof ErrorClass)
  })
})
