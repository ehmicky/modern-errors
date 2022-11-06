import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'
import { getUnknownErrorInstances } from '../../helpers/unknown.js'

const { ErrorClasses } = getClasses()

const messages = ['', 'test: ']

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
    error.stack = error.stack.replace(ErrorClass.name, causeName)
    const newError = new TestError('', { cause: error })
    t.is(newError.message, `${causeName}: ${causeMessage}`)
    t.true(newError.stack.includes(`${causeName}:`))
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
