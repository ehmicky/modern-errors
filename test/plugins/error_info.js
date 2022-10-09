import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../helpers/info.js'
import { getNativeErrors } from '../helpers/known.js'
import { defineGlobalOpts, defineClassOpts } from '../helpers/main.js'

const ErrorClasses = defineClassOpts()
const { TestError, UnknownError } = ErrorClasses

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  getNativeErrors(),
  ({ title }, getValues, getError) => {
    test(`errorInfo normalizes errors | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(getError).unknownDeep)
    })
  },
)

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, getValues) => {
    test(`errorInfo returns unknownDeep | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(new UnknownError('test')).unknownDeep)
      t.false(errorInfo(new TestError('test')).unknownDeep)
    })

    test(`errorInfo returns instance options | ${title}`, (t) => {
      const { errorInfo } = getValues({ ErrorClasses })
      t.true(errorInfo(new TestError('test', { prop: true })).options.prop)
    })
  },
)

each([getPropertiesInfo, getInstanceInfo], ({ title }, getValues) => {
  test(`errorInfo ignores parent instance options | ${title}`, (t) => {
    const { errorInfo } = getValues({
      ErrorClasses,
      instanceOpts: { prop: true },
    })
    t.is(errorInfo(new TestError('test')).options.prop, undefined)
  })
})

each(
  [(error) => error.properties, (error) => error.getInstance()],
  ({ title }, getSpecifics) => {
    test(`errorInfo can be applied on error itself | ${title}`, (t) => {
      const error = new TestError('test', { prop: true })
      const { errorInfo } = getSpecifics(error)
      const { options, unknownDeep } = errorInfo(error)
      t.true(options.prop)
      t.false(unknownDeep)
    })
  },
)

each([getInstanceInfo, getStaticInfo], ({ title }, getValues) => {
  test(`errorInfo returns method options | ${title}`, (t) => {
    const { errorInfo } = getValues({ ErrorClasses, methodOpts: true })
    t.true(errorInfo(new TestError('test')).options.prop)
  })

  test(`errorInfo method options have more priority than instance options | ${title}`, (t) => {
    const { errorInfo } = getValues({ ErrorClasses, methodOpts: true })
    t.true(errorInfo(new TestError('test', { prop: false })).options.prop)
  })
})

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    test(`errorInfo returns global and class options | ${title}`, (t) => {
      const OtherErrorClasses = defineOpts({ prop: true })
      const { errorInfo } = getValues({ ErrorClasses: OtherErrorClasses })
      t.true(errorInfo(new OtherErrorClasses.TestError('test')).options.prop)
    })

    test(`errorInfo global and class options have less priority than instance options | ${title}`, (t) => {
      const OtherErrorClasses = defineOpts({ prop: false })
      const { errorInfo } = getValues({ ErrorClasses: OtherErrorClasses })
      t.true(
        errorInfo(new OtherErrorClasses.TestError('test', { prop: true }))
          .options.prop,
      )
    })
  },
)

each(
  [getInstanceInfo, getStaticInfo],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    test(`errorInfo global and class options have less priority than method options | ${title}`, (t) => {
      const OtherErrorClasses = defineOpts({ prop: false })
      const { errorInfo } = getValues({
        methodOpts: true,
        ErrorClasses: OtherErrorClasses,
      })
      t.true(errorInfo(new OtherErrorClasses.TestError('test')).options.prop)
    })
  },
)
