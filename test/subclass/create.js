import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'

const { ErrorClasses } = getClasses()

const { hasOwnProperty: hasOwn } = Object.prototype

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Does not modify invalid classes | ${title}`, (t) => {
    class custom extends Object {}
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { custom }))
    t.false('name' in custom.prototype)
  })

  test(`ErrorClass.name is correct | ${title}`, (t) => {
    t.not(ErrorClass.name, '')
  })

  test(`prototype.name is correct | ${title}`, (t) => {
    t.is(ErrorClass.prototype.name, ErrorClass.name)
    t.false(
      Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'name').enumerable,
    )
  })

  test(`error.name is correct | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.false(hasOwn.call(error, 'name'))
    t.is(error.name, ErrorClass.name)
  })

  test(`Allows duplicate names | ${title}`, (t) => {
    t.is(ErrorClass.subclass(ErrorClass.name).name, ErrorClass.name)
  })

  test(`Core static methods are not enumerable | ${title}`, (t) => {
    t.deepEqual(Object.keys(ErrorClass), [])
  })

  test(`ErrorClass.subclass() context is bound | ${title}`, (t) => {
    const { subclass } = ErrorClass
    const TestError = subclass('TestError')
    t.true(new TestError('message') instanceof TestError)
  })
})

each(
  ErrorClasses,
  [
    undefined,
    '',
    {},
    'Error',
    'TypeError',
    'inputError',
    'input_error',
    'input',
  ],
  ({ title }, ErrorClass, errorName) => {
    test(`Validate invalid error name | ${title}`, (t) => {
      t.throws(ErrorClass.subclass.bind(undefined, errorName))
    })
  },
)
