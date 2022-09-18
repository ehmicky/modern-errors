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
const { ShallowError } = defineShallowCustom()
const { SimpleCustomError } = defineSimpleCustom()
const { DeepCustomError } = defineDeepCustom()

each(
  ['Error', 'TypeError', 'inputError', 'input_error', 'input'],
  ({ title }, errorName) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(defineClassesOpts.bind(undefined, { [errorName]: {} }))
    })
  },
)

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Can define custom classes| ${title}`, (t) => {
    t.true(new ErrorClass('test').prop)
  })
})

each([TestError, ShallowError], ({ title }, ErrorClass) => {
  test(`Parent class is AnyError by default | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass).name, 'AnyError')
  })
})

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Parent class is custom class when passed | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass).name, ErrorClass.name)
  })
})

each(
  [TestError, ShallowError, SimpleCustomError, DeepCustomError],
  ({ title }, ErrorClass) => {
    test(`prototype.name is correct | ${title}`, (t) => {
      t.is(ErrorClass.prototype.name, ErrorClass.name)
      t.false(
        Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'name')
          .enumerable,
      )
      t.is(new ErrorClass('test').name, ErrorClass.name)
    })
  },
)
