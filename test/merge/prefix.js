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
    const causeMessage = 'causeMessage'
    const TestError = ErrorClass.subclass('TestError')
    const OtherError = ErrorClass.subclass('OtherError')
    const error = new OtherError(causeMessage)
    const newError = new TestError(message, { cause: error })
    t.is(newError.message, `${message}${error.name}: ${causeMessage}`)
    t.true(newError.stack.includes(`${error.name}:`))
    t.is(error.message, causeMessage)
  })

  test(`Name of cause with same class is kept if changed | ${title}`, (t) => {
    const causeMessage = 'causeMessage'
    const causeName = 'NamedError'
    const error = new ErrorClass(causeMessage)
    error.name = causeName
    const newError = new ErrorClass(message, { cause: error })
    t.is(newError.message, `${message}${causeName}: ${causeMessage}`)
    t.true(newError.stack.includes(`${causeName}:`))
  })

  test(`Name of cause with subclass is kept if changed | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const causeMessage = 'causeMessage'
    const causeName = 'NamedError'
    const error = new TestError(causeMessage)
    error.name = causeName
    const newError = new ErrorClass(message, { cause: error })
    t.is(newError.message, `${message}${causeName}: ${causeMessage}`)
    t.true(newError.stack.includes(`${causeName}:`))
  })

  test(`Name of cause with superclass is kept if changed | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const causeMessage = 'causeMessage'
    const causeName = 'NamedError'
    const error = new ErrorClass(causeMessage)
    error.name = causeName
    const newError = new TestError(message, { cause: error })
    t.is(newError.message, `${message}${causeName}: ${causeMessage}`)
    t.is(error.message, causeMessage)
  })
})

each(
  ErrorClasses,
  getUnknownErrorInstances(),
  messages,
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, getUnknownError, message) => {
    test(`Unknown cause name is kept if changed | ${title}`, (t) => {
      const error = getUnknownError()
      const causeName = 'NamedError'
      error.name = causeName
      const { message: causeMessage } = error
      const newError = new ErrorClass(message, { cause: error })
      t.is(newError.message, `${message}${causeName}: ${causeMessage}`)
      t.true(newError.stack.includes(`${causeName}:`))
      const { message: newMessage } = error
      t.is(newMessage, causeMessage)
    })
  },
)

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
