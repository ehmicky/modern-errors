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
    {
      ErrorClass: TestError,
      className: 'TestError',
      parentClassName: 'BaseError',
    },
    {
      ErrorClass: defineCustomClass(class extends Error {}).InputError,
      className: 'InputError',
      parentClassName: 'BaseError',
    },
    {
      ErrorClass: defineClassesOpts({
        AnyError: { custom: class extends Error {} },
        InputError: { custom: class extends Error {} },
      }).InputError,
      className: 'InputError',
      parentClassName: 'GlobalBaseError',
    },
  ],
  ({ title }, { ErrorClass, className, parentClassName }) => {
    test(`Errors extend from BaseError or GlobalBaseError | ${title}`, (t) => {
      t.is(Object.getPrototypeOf(ErrorClass).name, parentClassName)
      t.is(Object.getPrototypeOf(ErrorClass.prototype).name, parentClassName)
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
  [
    'BaseError',
    'GlobalBaseError',
    'Error',
    'TypeError',
    'inputError',
    'input_error',
    'input',
  ],
  ({ title }, errorName) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(defineClassesOpts.bind(undefined, { [errorName]: {} }))
    })
  },
)

each([undefined, class extends Error {}], ({ title }, custom) => {
  test(`Can define AnyError.custom | ${title}`, (t) => {
    const { InputError } = defineClassesOpts({
      AnyError: {
        custom: class extends Error {
          prop = true
        },
      },
      InputError: { custom },
    })
    t.true(new InputError('message').prop)
  })
})
