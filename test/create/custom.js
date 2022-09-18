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
      parentClassName: 'AnyError',
    },
    {
      ErrorClass: defineCustomClass(class extends Error {}).InputError,
      className: 'InputError',
      parentClassName: 'AnyError',
    },
    {
      ErrorClass: defineClassesOpts(
        { InputError: { custom: class extends Error {} } },
        { custom: class extends Error {} },
      ).InputError,
      className: 'InputError',
      parentClassName: 'GlobalAnyError',
    },
  ],
  ({ title }, { ErrorClass, className, parentClassName }) => {
    test(`Errors extend from AnyError or GlobalAnyError | ${title}`, (t) => {
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
    'GlobalAnyError',
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
    const { InputError } = defineClassesOpts(
      { InputError: { custom } },
      {
        custom: class extends Error {
          prop = true
        },
      },
    )
    t.true(new InputError('message').prop)
  })
})
