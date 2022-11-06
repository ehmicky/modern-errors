import test from 'ava'
import { each } from 'test-each'

import { getClasses, ModernError } from '../helpers/main.js'

const { ErrorClasses, ErrorSubclasses, ChildError } = getClasses()

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
    t.true(normalizedError instanceof ErrorClass)
    t.is(normalizedError.name, name)
    t.false(Object.getOwnPropertyDescriptor(error, 'name').enumerable)
    t.is(normalizedError.message, '')
  })

  test(`ErrorClass.normalize() keeps error class if known | ${title}`, (t) => {
    const error = new ChildError('test')
    const normalizedError = ErrorClass.normalize(error)
    t.is(error, normalizedError)
    t.is(normalizedError.constructor, ChildError)
  })

  test(`ErrorClass.normalize() context is bound | ${title}`, (t) => {
    const { normalize } = ErrorClass
    t.true(normalize() instanceof Error)
  })
})

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`ErrorClass.normalize() prevents naming collisions | ${title}`, (t) => {
    const OtherAnyError = ModernError.subclass('AnyError')
    const normalizedError = ErrorClass.normalize(new OtherAnyError('test'))
    t.is(normalizedError.constructor, ErrorClass)
  })
})
