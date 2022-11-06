import test from 'ava'
import isErrorInstance from 'is-error-instance'
import { each } from 'test-each'

import {
  KnownErrorClasses,
  getUnknownErrors,
  getUnknownErrorInstances,
  AnyError,
  TestError,
  ChildTestError,
  SiblingError,
} from '../helpers/known.js'

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
  test(`Name of AnyError cause is ignored | ${title}`, (t) => {
    const cause = new AnyError('causeMessage')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })

  test(`Name of cause with same class is ignored | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    t.is(new ErrorClass('', { cause }).message, cause.message)
  })
})

test('Name of cause with subclass is ignored', (t) => {
  const cause = new ChildTestError('causeMessage')
  t.is(new TestError('', { cause }).message, cause.message)
})

test('Name of cause with superclass is kept', (t) => {
  const cause = new TestError('causeMessage')
  t.is(
    new ChildTestError('', { cause }).message,
    `${cause.name}: ${cause.message}`,
  )
})

test('Name of cause with unrelated class is kept', (t) => {
  const cause = new SiblingError('causeMessage')
  t.is(new TestError('', { cause }).message, `${cause.name}: ${cause.message}`)
})
