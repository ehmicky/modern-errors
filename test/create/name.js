import test from 'ava'
import { each } from 'test-each'

import {
  createAnyError,
  defineSimpleClass,
  defineShallowCustom,
  defineSimpleCustom,
  defineDeepCustom,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()
const { ShallowError } = defineShallowCustom()
const { DeepCustomError } = defineDeepCustom()
const { SimpleCustomError } = defineSimpleCustom()

test('Require defining UnknownError', (t) => {
  const { create } = createAnyError()
  t.throws(create.bind(undefined, 'InputError'))
})

test('Validate against duplicate names', (t) => {
  t.throws(AnyError.create.bind(undefined, 'TestError'))
})

each(
  [
    undefined,
    '',
    {},
    'AnyError',
    'Error',
    'TypeError',
    'inputError',
    'input_error',
    'input',
  ],
  ({ title }, errorName) => {
    test(`Validate invalid error name | ${title}`, (t) => {
      t.throws(AnyError.create.bind(undefined, errorName))
    })
  },
)

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
