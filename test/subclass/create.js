import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'

const { KnownErrorClasses } = getClasses()

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`Does not modify invalid classes | ${title}`, (t) => {
    class custom extends Object {}
    t.throws(ErrorClass.subclass.bind(undefined, 'TestError', { custom }))
    t.false('name' in custom.prototype)
  })

  test(`Static methods are not enumerable | ${title}`, (t) => {
    t.deepEqual(Object.keys(ErrorClass), [])
  })

  test(`Allows duplicate names | ${title}`, (t) => {
    const DuplicateClass = ErrorClass.subclass(ErrorClass.name)
    t.is(DuplicateClass.name, ErrorClass.name)
  })

  test(`prototype.name is correct | ${title}`, (t) => {
    t.is(ErrorClass.prototype.name, ErrorClass.name)
    t.false(
      Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'name').enumerable,
    )
    t.is(new ErrorClass('test').name, ErrorClass.name)
  })
})

each(
  KnownErrorClasses,
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
