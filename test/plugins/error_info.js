import test from 'ava'
import { each } from 'test-each'

import { getNativeErrors } from '../helpers/known.js'
import { defineGlobalOpts, defineClassOpts } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()

const getSetArgs = function ({
  ErrorClasses: { TestError: TestErrorClass = TestError } = {},
  instanceOpts,
}) {
  return new TestErrorClass('test', instanceOpts).properties
}

const getInstanceArgs = function ({
  ErrorClasses: { TestError: TestErrorClass = TestError } = {},
  instanceOpts,
  methodOpts,
}) {
  return new TestErrorClass('test', instanceOpts).getInstance(methodOpts)
}

const getStaticArgs = function ({
  ErrorClasses: { AnyError: AnyErrorClass = AnyError } = {},
  methodOpts,
}) {
  return AnyErrorClass.getProp(methodOpts)
}

each(
  [getSetArgs, getInstanceArgs, getStaticArgs],
  getNativeErrors(),
  ({ title }, getValues, getError) => {
    test(`errorInfo normalizes errors | ${title}`, (t) => {
      const { errorInfo } = getValues({})
      t.true(errorInfo(getError).unknownDeep)
    })
  },
)

each([getSetArgs, getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  test(`errorInfo returns unknownDeep | ${title}`, (t) => {
    const { errorInfo } = getValues({})
    t.true(errorInfo(new UnknownError('test')).unknownDeep)
    t.false(errorInfo(new TestError('test')).unknownDeep)
  })

  test(`errorInfo returns instance options | ${title}`, (t) => {
    const { errorInfo } = getValues({})
    t.true(errorInfo(new TestError('test', { prop: true })).options.prop)
  })
})

each([getSetArgs, getInstanceArgs], ({ title }, getValues) => {
  test(`errorInfo ignores parent instance options | ${title}`, (t) => {
    const { errorInfo } = getValues({ instanceOpts: { prop: true } })
    t.is(errorInfo(new TestError('test')).options.prop, undefined)
  })
})

each([getInstanceArgs, getStaticArgs], ({ title }, getValues) => {
  test(`errorInfo returns method options | ${title}`, (t) => {
    const { errorInfo } = getValues({ methodOpts: true })
    t.true(errorInfo(new TestError('test')).options.prop)
  })

  test(`errorInfo method options have more priority than instance options | ${title}`, (t) => {
    const { errorInfo } = getValues({ methodOpts: true })
    t.true(errorInfo(new TestError('test', { prop: false })).options.prop)
  })
})

each(
  [getSetArgs, getInstanceArgs, getStaticArgs],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    test(`errorInfo returns global and class options | ${title}`, (t) => {
      const ErrorClasses = defineOpts({ prop: true })
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(new ErrorClasses.TestError('test')).options.prop)
    })

    test(`errorInfo global and class options have less priority than instance options | ${title}`, (t) => {
      const ErrorClasses = defineOpts({ prop: false })
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(
        errorInfo(new ErrorClasses.TestError('test', { prop: true })).options
          .prop,
      )
    })
  },
)

each(
  [getInstanceArgs, getStaticArgs],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    test(`errorInfo global and class options have less priority than method options | ${title}`, (t) => {
      const ErrorClasses = defineOpts({ prop: false })
      const { errorInfo } = getValues({ methodOpts: true, ErrorClasses })
      t.true(errorInfo(new ErrorClasses.TestError('test')).options.prop)
    })
  },
)
