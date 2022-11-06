import test from 'ava'
import isErrorInstance from 'is-error-instance'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'
import {
  getUnknownErrors,
  getUnknownErrorInstances,
} from '../helpers/unknown.js'

const { ErrorClasses } = getClasses()

const messages = ['', 'test: ']

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Name of cause with same class is ignored | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })

  test(`Name of cause with subclass is ignored | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const cause = new TestError('causeMessage')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })

  test(`Name of cause with superclass is ignored | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const cause = new ErrorClass('causeMessage')
    t.is(new TestError('', { cause }).message, cause.message)
  })
})

each(ErrorClasses, messages, ({ title }, ErrorClass, message) => {
  test(`Name of cause with unrelated class is kept | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const OtherError = ErrorClass.subclass('OtherError')
    const cause = new OtherError('causeMessage')
    t.is(
      new TestError(message, { cause }).message,
      `${message}${cause.name}: ${cause.message}`,
    )
  })

  test(`Name of cause with same class is kept if changed | ${title}`, (t) => {
    const causeMessage = 'causeMessage'
    const causeName = 'NamedError'
    const error = new ErrorClass(causeMessage)
    error.name = causeName
    t.is(
      new ErrorClass(message, { cause: error }).message,
      `${message}${causeName}: ${causeMessage}`,
    )
  })

  test(`Name of cause with subclass is kept if changed | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const causeMessage = 'causeMessage'
    const causeName = 'NamedError'
    const error = new TestError(causeMessage)
    error.name = causeName
    t.is(
      new ErrorClass(message, { cause: error }).message,
      `${message}${causeName}: ${causeMessage}`,
    )
  })

  test(`Name of cause with superclass is kept if changed | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const causeMessage = 'causeMessage'
    const causeName = 'NamedError'
    const error = new ErrorClass(causeMessage)
    error.name = causeName
    t.is(
      new TestError(message, { cause: error }).message,
      `${message}${causeName}: ${causeMessage}`,
    )
  })
})

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Handle invalid error message | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const OtherError = ErrorClass.subclass('OtherError')
    const error = new OtherError('')
    error.message = true
    t.is(new TestError('', { cause: error }).message, error.name)
  })
})

const getExpectedMessage = function (cause) {
  if (isErrorInstance(cause)) {
    return cause.message
  }

  return cause === undefined ? '' : String(cause)
}

each(
  ErrorClasses,
  [
    ...getUnknownErrors(),
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new Error('test'), { name: true }),
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new Error('test'), { name: '' }),
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new Error('test'), { constructor: undefined }),
  ],
  ({ title }, ErrorClass, getUnknownError) => {
    test(`Cause name is ignored if generic | ${title}`, (t) => {
      const cause = getUnknownError()
      t.is(getExpectedMessage(cause), new ErrorClass('', { cause }).message)
    })

    test(`Generated stacks are not used | ${title}`, (t) => {
      const cause = getUnknownError()
      t.false(
        new ErrorClass('', { cause }).stack.includes('normalize-exception'),
      )
    })
  },
)

each(
  ErrorClasses,
  getUnknownErrorInstances(),
  messages,
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, getUnknownError, message) => {
    test(`Unknown cause name is kept if changed | ${title}`, (t) => {
      const error = getUnknownError()
      error.name = 'NamedError'
      t.is(
        new ErrorClass(message, { cause: error }).message,
        `${message}${error.name}: ${error.message}`,
      )
    })
  },
)
