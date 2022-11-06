import test from 'ava'
import { each } from 'test-each'

import {
  createAnyError,
  defineClassOpts,
  defineSimpleCustom,
  defineDeepCustom,
} from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()
const { TestError: DeepCustomError } = defineDeepCustom()
const { SimpleCustomError } = defineSimpleCustom()

test('Validate against duplicate names', (t) => {
  t.throws(AnyError.subclass.bind(undefined, 'TestError'))
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
      t.throws(AnyError.subclass.bind(undefined, errorName))
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

test('Require defining UnknownError before creating errors', (t) => {
  const TestAnyError = createAnyError()
  t.throws(TestAnyError.subclass.bind(undefined, 'TestError'))
})