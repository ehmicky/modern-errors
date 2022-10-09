import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  AnyError,
  UnknownError,
  getNativeErrors,
} from '../helpers/known.js'

test('unknownDeep is false with known errors', (t) => {
  t.false(new TestError('test').properties.unknownDeep)
})

each([TestError, AnyError], ({ title }, ErrorClass) => {
  test(`unknownDeep is false when wrapping known errors | ${title}`, (t) => {
    const cause = new TestError('causeMessage')
    t.false(new ErrorClass('test', { cause }).properties.unknownDeep)
  })
})

each(
  [...getNativeErrors(), () => new UnknownError('test')],
  ({ title }, getError) => {
    test(`unknownDeep is true with unknown errors | ${title}`, (t) => {
      const cause = getError()
      t.true(new TestError('test', { cause }).properties.unknownDeep)
    })
  },
)

each(
  [TestError, AnyError],
  [...getNativeErrors(), () => new UnknownError('test')],
  ({ title }, ErrorClass, getError) => {
    test(`unknownDeep is true when wrapping unknown errors | ${title}`, (t) => {
      const cause = getError()
      const error = new TestError('causeMessage', { cause })
      t.true(new ErrorClass('test', { cause: error }).properties.unknownDeep)
    })
  },
)
