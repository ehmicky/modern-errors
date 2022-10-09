import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  AnyError,
  UnknownError,
  getUnknownErrors,
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

const unknownErrors = [...getUnknownErrors(), new UnknownError('test')]

each(unknownErrors, ({ title }, cause) => {
  test(`unknownDeep is true with unknown errors | ${title}`, (t) => {
    t.true(new TestError('test', { cause }).properties.unknownDeep)
  })
})

each(unknownErrors, [TestError, AnyError], ({ title }, cause, ErrorClass) => {
  test(`unknownDeep is true when wrapping unknown errors | ${title}`, (t) => {
    const error = new TestError('causeMessage', { cause })
    t.true(new ErrorClass('test', { cause: error }).properties.unknownDeep)
  })
})
