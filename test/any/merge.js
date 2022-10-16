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
  getNativeErrors,
} from '../helpers/known.js'

const assertInstanceOf = function (t, error, ErrorClass) {
  t.true(error instanceof ErrorClass)
  t.is(Object.getPrototypeOf(error), ErrorClass.prototype)
  t.is(error.name, ErrorClass.name)
}

each([...getKnownErrors(), ...getUnknownErrors()], ({ title }, getError) => {
  test(`AnyError with known cause uses child class | ${title}`, (t) => {
    const cause = getError()
    const error = new AnyError('message', { cause })
    assertInstanceOf(t, error, cause.constructor)
  })
})

each(getNativeErrors(), ({ title }, getError) => {
  test(`AnyError with unknown cause uses UnknownError | ${title}`, (t) => {
    const cause = getError()
    const error = new AnyError('message', { cause })
    assertInstanceOf(t, error, UnknownError)
  })
})

each(
  [...KnownErrorClasses, ...UnknownErrorClasses],
  [...getKnownErrors(), ...getUnknownErrors(), ...getNativeErrors()],
  ({ title }, ErrorClass, getError) => {
    test(`Known class with known or unknown cause uses parent class | ${title}`, (t) => {
      const cause = getError()
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
    const cause = undefined
    const error = new ErrorClass(outerMessage, { cause })
    t.false('cause' in error)
    t.is(error.message, `${cause}\n${outerMessage}`)
  })
})
