import test from 'ava'
import { each } from 'test-each'

import {
  defineSimpleClass,
  defineSimpleCustom,
  defineDeepCustom,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()
const { DeepCustomError } = defineDeepCustom()
const { SimpleCustomError } = defineSimpleCustom()

test('Validate against duplicate names', (t) => {
  t.throws(AnyError.class.bind(undefined, 'TestError'))
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
      t.throws(AnyError.class.bind(undefined, errorName))
    })
  },
)

each(
  [TestError, SimpleCustomError, DeepCustomError],
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
