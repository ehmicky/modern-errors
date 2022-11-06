import test from 'ava'
import isErrorInstance from 'is-error-instance'
import { each } from 'test-each'

import {
  getClasses,
  ModernError,
  getUnknownErrors,
  getUnknownErrorInstances,
} from '../helpers/main.js'

const { KnownErrorClasses, SpecificErrorClasses } = getClasses()

const getExpectedMessage = function (cause) {
  if (isErrorInstance(cause)) {
    return cause.message
  }

  return cause === undefined ? '' : String(cause)
}

each(
  KnownErrorClasses,
  getUnknownErrors(),
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
  KnownErrorClasses,
  getUnknownErrorInstances(),
  ['', 'test: '],
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, getUnknownError, message) => {
    test(`Unknown cause name is kept | ${title}`, (t) => {
      const error = getUnknownError()
      error.name = 'NamedError'
      t.is(
        new ErrorClass(message, { cause: error }).message,
        `${message}${error.name}: ${error.message}`,
      )
    })
  },
)

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`Name of cause with same class is ignored | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })

  test(`Name of cause with subclass is ignored | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    t.is(new ModernError('', { cause }).message, cause.message)
  })

  test(`Name of cause with superclass is ignored | ${title}`, (t) => {
    const cause = new ModernError('causeMessage')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })
})

each(SpecificErrorClasses, ({ title }, ErrorClass) => {
  test(`Name of cause with unrelated class is kept | ${title}`, (t) => {
    const UnrelatedError = ModernError.subclass('UnrelatedError')
    const cause = new UnrelatedError('causeMessage')
    t.is(
      new ErrorClass('', { cause }).message,
      `${cause.name}: ${cause.message}`,
    )
  })
})
