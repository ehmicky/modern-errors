import test from 'ava'
import { each } from 'test-each'

import {
  defineClassesOpts,
  defineSimpleClass,
  defineShallowCustom,
  defineSimpleCustom,
  defineDeepCustom,
} from '../helpers/main.js'

const { TestError } = defineSimpleClass()
const ShallowError = defineShallowCustom()
const SimpleCustomError = defineSimpleCustom()
const DeepCustomError = defineDeepCustom()

each(
  [
    {
      ErrorClass: TestError,
      className: 'TestError',
      parentClassName: 'CoreError',
    },
    {
      ErrorClass: ShallowError,
      className: 'ShallowError',
      parentClassName: 'CoreError',
    },
    {
      ErrorClass: SimpleCustomError,
      className: 'SimpleCustomError',
      parentClassName: 'AnyError',
    },
    {
      ErrorClass: DeepCustomError,
      className: 'DeepCustomError',
      parentClassName: 'ParentError',
    },
  ],
  ({ title }, { ErrorClass, className, parentClassName }) => {
    test(`Errors extend from AnyError | ${title}`, (t) => {
      t.is(
        Object.getPrototypeOf(Object.getPrototypeOf(ErrorClass)).name,
        parentClassName,
      )
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

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Can define custom classes| ${title}`, (t) => {
    t.true(new ErrorClass('test').prop)
  })
})

each(
  ['Error', 'TypeError', 'inputError', 'input_error', 'input'],
  ({ title }, errorName) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(defineClassesOpts.bind(undefined, { [errorName]: {} }))
    })
  },
)
