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
  crossRealmError,
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
  [undefined, null, true, {}, { name: 'Error' }, testError],
  ({ title }, value) => {
    test(`AnyError.parse() does not normalize top-level non-error plain objects | ${title}`, (t) => {
      t.deepEqual(AnyError.parse(value), value)
    })
  },
)

each([nativeError, crossRealmError], ({ title }, error) => {
  test(`AnyError.parse() normalize top-level native errors | ${title}`, (t) => {
    t.true(AnyError.parse(error) instanceof UnknownError)
  })

  test(`AnyError.parse() does not normalize deep native errors | ${title}`, (t) => {
    t.false(AnyError.parse([error])[0] instanceof UnknownError)
  })
})
