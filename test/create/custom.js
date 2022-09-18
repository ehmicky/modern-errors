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
      ErrorClass: defineClassesOpts((AnyError) => ({
        InputError: {
          custom: class extends class SharedError extends AnyError {} {},
        },
      })).InputError,
      className: 'InputError',
      parentClassName: 'SharedError',
    },
  ],
  ({ title }, { ErrorClass, className, parentClassName }) => {
    test(`Errors extend from AnyError | ${title}`, (t) => {
      t.is(Object.getPrototypeOf(ErrorClass).name, parentClassName)
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
  ['Error', 'TypeError', 'inputError', 'input_error', 'input'],
  ({ title }, errorName) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(defineClassesOpts.bind(undefined, { [errorName]: {} }))
    })
  },
)

each(
  [(ErrorClass) => ErrorClass, (ErrorClass) => class extends ErrorClass {}],
  ({ title }, wrapClass) => {
    test(`Can define custom classes| ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      const { InputError } = defineClassesOpts((AnyError) => ({
        InputError: {
          custom: wrapClass(
            class extends AnyError {
              prop = true
            },
          ),
        },
      }))
      t.true(new InputError('message').prop)
    })
  },
)
