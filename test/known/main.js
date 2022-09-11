import test from 'ava'
import { each } from 'test-each'

import {
  defineClassesOpts,
  defineSimpleClass,
  defineCustomClass,
} from '../helpers/main.js'

const { TestError } = defineSimpleClass()

each(
  [
    { ErrorClass: TestError, className: 'TestError' },
    {
      ErrorClass: defineCustomClass(class extends Error {}).InputError,
      className: 'InputError',
    },
  ],
  ({ title }, { ErrorClass, className }) => {
    test(`Errors extend from BaseError | ${title}`, (t) => {
      t.is(Object.getPrototypeOf(ErrorClass).name, 'BaseError')
      t.is(Object.getPrototypeOf(ErrorClass.prototype).name, 'BaseError')
    })

    test(`prototype.name is correct | ${title}`, (t) => {
      t.is(ErrorClass.name, className)
      t.is(ErrorClass.prototype.name, className)
      t.false(
        Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'name')
          .enumerable,
      )
      t.is(new ErrorClass('test').name, className)
    })
  },
)

each(
  ['BaseError', 'Error', 'TypeError', 'inputError', 'input_error', 'input'],
  ({ title }, errorName) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(defineClassesOpts.bind(undefined, { [errorName]: {} }))
    })
  },
)

test('Does not modify invalid classes', (t) => {
  class custom extends Object {}
  t.throws(defineCustomClass.bind(undefined, custom))
  t.false('name' in custom.prototype)
})
