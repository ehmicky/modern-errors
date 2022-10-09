import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  UnknownError,
  AnyError,
  KnownErrorClasses,
  UnknownErrorClasses,
  getKnownErrors,
  getUnknownErrors,
} from '../helpers/known.js'

const assertInstanceOf = function (t, error, ErrorClass) {
  t.true(error instanceof ErrorClass)
  t.is(Object.getPrototypeOf(error), ErrorClass.prototype)
  t.is(error.name, ErrorClass.name)
}

each(getKnownErrors(), ({ title }, cause) => {
  test(`AnyError with known cause uses child class | ${title}`, (t) => {
    const error = new AnyError('message', { cause })
    assertInstanceOf(t, error, cause.constructor)
  })
})

each(getUnknownErrors(), ({ title }, cause) => {
  test(`AnyError with unknown cause uses UnknownError | ${title}`, (t) => {
    const error = new AnyError('message', { cause })
    assertInstanceOf(t, error, UnknownError)
  })
})

each(
  [...KnownErrorClasses, ...UnknownErrorClasses],
  [...getKnownErrors(), ...getUnknownErrors()],
  ({ title }, ErrorClass, cause) => {
    test(`Known class with known or unknown cause uses parent class | ${title}`, (t) => {
      const error = new ErrorClass('message', { cause })
      assertInstanceOf(t, error, ErrorClass)
    })
  },
)

test('AnyError with known cause uses its instance', (t) => {
  const cause = new TestError('causeMessage')
  t.is(new AnyError('message', { cause }), cause)
})

each([TestError, AnyError], ({ title }, ErrorClass) => {
  test(`"cause" is merged | ${title}`, (t) => {
    const outerMessage = 'message'
    const innerMessage = 'causeMessage'
    const error = new ErrorClass(outerMessage, { cause: innerMessage })
    t.false('cause' in error)
    t.is(error.message, `${innerMessage}\n${outerMessage}`)
  })

  test(`"cause" can have undefined value | ${title}`, (t) => {
    const outerMessage = 'message'
    const error = new ErrorClass(outerMessage, { cause: undefined })
    t.false('cause' in error)
    t.is(error.message, outerMessage)
  })
})
