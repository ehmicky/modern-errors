import test from 'ava'
import isErrorInstance from 'is-error-instance'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.test.js'
import { getUnknownErrors } from '../../helpers/unknown.test.js'

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
        new ErrorClass('', { cause }).stack.includes(GENERATED_STACK_HINT),
      )
    })
  },
)

const GENERATED_STACK_HINT = 'normalize-exception'

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Handle invalid error message | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const OtherError = ErrorClass.subclass('OtherError')
    const error = new OtherError('')
    error.message = true
    t.is(new TestError('', { cause: error }).message, error.name)
  })
})
