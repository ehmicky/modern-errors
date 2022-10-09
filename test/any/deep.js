import test from 'ava'
import { each } from 'test-each'

import {
  AnyError,
  getKnownErrors,
  KnownErrorClasses,
  UnknownErrorClasses,
  getNativeErrors,
  getUnknownErrors,
} from '../helpers/known.js'

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`unknownDeep is false with known errors | ${title}`, (t) => {
    t.false(new ErrorClass('test').properties.unknownDeep)
  })
})

each(UnknownErrorClasses, ({ title }, ErrorClass) => {
  test(`unknownDeep is true with unknown errors | ${title}`, (t) => {
    t.true(new ErrorClass('test').properties.unknownDeep)
  })
})

each(
  [AnyError, ...KnownErrorClasses],
  getKnownErrors(),
  ({ title }, ErrorClass, getError) => {
    test(`unknownDeep is false when wrapping known errors with known classes | ${title}`, (t) => {
      const cause = getError()
      t.false(new ErrorClass('test', { cause }).properties.unknownDeep)
    })
  },
)

each(
  UnknownErrorClasses,
  getKnownErrors(),
  ({ title }, ErrorClass, getError) => {
    test(`unknownDeep is true when wrapping known errors with unknown classes | ${title}`, (t) => {
      const cause = getError()
      t.true(new ErrorClass('test', { cause }).properties.unknownDeep)
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  [...getNativeErrors(), ...getUnknownErrors()],
  ({ title }, ErrorClass, getError) => {
    test(`unknownDeep is true when wrapping unknown errors | ${title}`, (t) => {
      const cause = getError()
      t.true(new ErrorClass('test', { cause }).properties.unknownDeep)
    })
  },
)
