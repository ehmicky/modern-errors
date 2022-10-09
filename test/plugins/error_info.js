import test from 'ava'
import { each } from 'test-each'

import { getNativeErrors } from '../helpers/known.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()

const getSetArgs = function ({ TestError: TestErrorClass = TestError } = {}) {
  return new TestErrorClass('test').properties
}

const getInstanceArgs = function ({
  TestError: TestErrorClass = TestError,
} = {}) {
  return new TestErrorClass('test').getInstance()
}

const getStaticArgs = function ({ AnyError: AnyErrorClass = AnyError } = {}) {
  return AnyErrorClass.getProp()
}

each(
  [getSetArgs, getInstanceArgs, getStaticArgs],
  getNativeErrors(),
  ({ title }, getValues, getError) => {
    const { errorInfo } = getValues()

    test(`errorInfo normalizes errors | ${title}`, (t) => {
      t.true(errorInfo(getError).unknownDeep)
    })
  },
)

each([getSetArgs, getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  const { errorInfo } = getValues()

  test(`errorInfo returns unknownDeep | ${title}`, (t) => {
    t.true(errorInfo(new UnknownError('test')).unknownDeep)
    t.false(errorInfo(new TestError('test')).unknownDeep)
  })
})
