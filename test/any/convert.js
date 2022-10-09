import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  UnknownError,
  AnyError,
  KnownErrorClasses,
  UnknownErrorClasses,
  getKnownErrors,
  getUnknownErrorInstances,
} from '../helpers/known.js'

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  [
    () => 'message',
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new TypeError('message'), { name: true }),
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new TestError('message'), { name: true }),
    () => new Error('message'),
    () => new TypeError('message'),
    () => new UnknownError('message'),
  ],
  ({ title }, ParentErrorClass, getCause) => {
    test(`Cause name is ignored if absent | ${title}`, (t) => {
      t.is(new ParentErrorClass('', { cause: getCause() }).message, 'message')
    })
  },
)

each(
  [AnyError, ...KnownErrorClasses, ...UnknownErrorClasses],
  getUnknownErrorInstances(),
  ['', 'test: '],
  // eslint-disable-next-line max-params
  ({ title }, ParentErrorClass, error, message) => {
    test(`Unknown cause name is kept | ${title}`, (t) => {
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
  getKnownErrors(),
  ({ title }, ErrorClass, cause) => {
    test(`Known cause name is ignored without UnknownError | ${title}`, (t) => {
      t.is(new ErrorClass('', { cause }).message, cause.message)
    })
  },
)

each(
  UnknownErrorClasses,
  getKnownErrors(),
  ({ title }, ParentErrorClass, cause) => {
    test(`Known cause name is kept with UnknownError and empty message | ${title}`, (t) => {
      t.is(
        new ParentErrorClass('', { cause }).message,
        cause.name === 'UnknownError'
          ? cause.message
          : `${cause.name}: ${cause.message}`,
      )
    })

    test(`Known cause name is ignored with UnknownError and non-empty message | ${title}`, (t) => {
      const parentMessage = 'parentMessage'
      t.is(
        new ParentErrorClass(parentMessage, { cause }).message,
        `${cause.message}\n${parentMessage}`,
      )
    })
  },
)
