import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  AnyError,
  UnknownError,
  testError,
  errorObject,
  nativeError,
  nativeErrorObject,
} from '../../helpers/serialize.js'

test('AnyError.parse() parses error plain objects', (t) => {
  t.deepEqual(AnyError.parse(errorObject), testError)
})

test('AnyError.parse() keeps error class', (t) => {
  t.true(AnyError.parse(errorObject) instanceof TestError)
})

test('AnyError.parse() is deep', (t) => {
  t.deepEqual(AnyError.parse([{ prop: errorObject }])[0].prop, testError)
})

test('AnyError.parse() parses native errors', (t) => {
  const [nativeErrorCopy] = AnyError.parse([nativeErrorObject])
  t.deepEqual(nativeErrorCopy, nativeError)
  t.true(nativeErrorCopy instanceof TypeError)
})

each(
  // eslint-disable-next-line unicorn/no-null
  [undefined, null, true, {}, { name: 'Error' }, testError],
  ({ title }, value) => {
    test(`AnyError.parse() does not normalize top-level non-error plain objects | ${title}`, (t) => {
      t.deepEqual(AnyError.parse(value), value)
    })
  },
)

test('AnyError.parse() normalize top-level native errors', (t) => {
  t.true(AnyError.parse(nativeError) instanceof UnknownError)
})

test('AnyError.parse() does not normalize deep native errors', (t) => {
  t.false(AnyError.parse([nativeError])[0] instanceof UnknownError)
})
