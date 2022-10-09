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
  getNativeErrorInstances,
} from '../helpers/known.js'

const getExpectedMessage = function (cause) {
  if (Object.prototype.toString.call(cause) === '[object Error]') {
    return cause.message
  }

  return cause === undefined ? '' : String(cause)
}

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  [
    ...getNativeErrors(),
    () => new UnknownError('message'),
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new TestError('message'), { name: true }),
  ],
  ({ title }, ParentErrorClass, getCause) => {
    test(`Cause name is ignored if absent | ${title}`, (t) => {
      const cause = getCause()
      t.is(
        getExpectedMessage(cause),
        new ParentErrorClass('', { cause }).message,
      )
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  getNativeErrorInstances(),
  ['', 'test: '],
  // eslint-disable-next-line max-params
  ({ title }, ParentErrorClass, getError, message) => {
    test(`Unknown cause name is kept | ${title}`, (t) => {
      const error = getError()
      error.name = 'NamedError'
      t.is(
        new ParentErrorClass(message, { cause: error }).message,
        `${message}${error.name}: ${error.message}`,
      )
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses],
  [...getKnownErrors(), ...getUnknownErrors()],
  ({ title }, ErrorClass, getError) => {
    test(`Known cause name is ignored without UnknownError | ${title}`, (t) => {
      const cause = getError()
      t.is(new ErrorClass('', { cause }).message, cause.message)
    })
  },
)

each(
  UnknownErrorClasses,
  [...getKnownErrors(), ...getUnknownErrors()],
  ({ title }, ParentErrorClass, getError) => {
    test(`Known cause name is kept with UnknownError and empty message | ${title}`, (t) => {
      const cause = getError()
      t.is(
        new ParentErrorClass('', { cause }).message,
        cause.name === 'UnknownError'
          ? cause.message
          : `${cause.name}: ${cause.message}`,
      )
    })

    test(`Known cause name is ignored with UnknownError and non-empty message | ${title}`, (t) => {
      const cause = getError()
      const parentMessage = 'parentMessage'
      t.is(
        new ParentErrorClass(parentMessage, { cause }).message,
        `${cause.message}\n${parentMessage}`,
      )
    })
  },
)
