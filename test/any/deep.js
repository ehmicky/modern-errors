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
  test(`showStack is false with known errors | ${title}`, (t) => {
    t.false(new ErrorClass('test').properties.showStack)
  })
})

each(UnknownErrorClasses, ({ title }, ErrorClass) => {
  test(`showStack is true with unknown errors | ${title}`, (t) => {
    t.true(new ErrorClass('test').properties.showStack)
  })
})

each(
  [AnyError, ...KnownErrorClasses],
  getKnownErrors(),
  ({ title }, ErrorClass, getError) => {
    test(`showStack is false when wrapping known errors with known classes | ${title}`, (t) => {
      const cause = getError()
      t.false(new ErrorClass('test', { cause }).properties.showStack)
    })
  },
)

each(
  UnknownErrorClasses,
  getKnownErrors(),
  ({ title }, ErrorClass, getError) => {
    test(`showStack is true when wrapping known errors with unknown classes | ${title}`, (t) => {
      const cause = getError()
      t.true(new ErrorClass('test', { cause }).properties.showStack)
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  [...getNativeErrors(), ...getUnknownErrors()],
  ({ title }, ErrorClass, getError) => {
    test(`showStack is true when wrapping unknown errors | ${title}`, (t) => {
      t.true(new ErrorClass('test', { cause: getError() }).properties.showStack)
    })
  },
)
