import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  testError,
  errorObject,
  nativeError,
} from '../../helpers/serialize.js'

const convertError = function ({ name, message, stack, one }) {
  return { name, message, stack, one }
}

test('error.toJSON() serializes', (t) => {
  t.deepEqual(errorObject, convertError(testError))
})

each([testError, nativeError], ({ title }, deepError) => {
  test(`error.toJSON() is deep | ${title}`, (t) => {
    const error = new TestError('test')
    error.prop = [deepError]
    t.deepEqual(error.toJSON().prop[0], convertError(deepError))
  })
})

test('error.toJSON() is not enumerable', (t) => {
  t.false(
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(Object.getPrototypeOf(testError)),
      'toJSON',
    ).enumerable,
  )
})
