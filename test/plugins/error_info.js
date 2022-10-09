import test from 'ava'
import { each } from 'test-each'

import { getNativeErrors } from '../helpers/known.js'
import { defineGlobalOpts, defineClassOpts } from '../helpers/main.js'

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

  test(`errorInfo returns instance options | ${title}`, (t) => {
    t.true(errorInfo(new TestError('test', { prop: true })).options.prop)
  })
})

each(
  [getSetArgs, getInstanceArgs, getStaticArgs],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    test(`errorInfo returns global and class options | ${title}`, (t) => {
      const ErrorClasses = defineOpts({ prop: true })
      const { errorInfo } = getValues(ErrorClasses)
      t.true(errorInfo(new ErrorClasses.TestError('test')).options.prop)
    })

    test(`errorInfo global and class options have less priority than instance options | ${title}`, (t) => {
      const ErrorClasses = defineOpts({ prop: false })
      const { errorInfo } = getValues(ErrorClasses)
      t.true(
        errorInfo(new ErrorClasses.TestError('test', { prop: true })).options
          .prop,
      )
    })
  },
)
