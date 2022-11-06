import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses } from '../helpers/known.js'

each(KnownErrorClasses, ({ title }, ErrorClass) => {
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
