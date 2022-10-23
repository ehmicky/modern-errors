import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../../helpers/info.js'
import { defineGlobalOpts, defineClassOpts } from '../../helpers/main.js'

const ErrorClasses = defineClassOpts()
const { TestError } = ErrorClasses

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, getValues) => {
    const { errorInfo } = getValues({ ErrorClasses })

    test(`errorInfo returns instance options | ${title}`, (t) => {
      t.true(errorInfo(new TestError('test', { prop: true })).options.prop)
    })
  },
)

each([getPropertiesInfo, getInstanceInfo], ({ title }, getValues) => {
  const { errorInfo } = getValues({
    ErrorClasses,
    instanceOpts: { prop: true },
  })

  test(`errorInfo ignores parent instance options | ${title}`, (t) => {
    t.is(errorInfo(new TestError('test')).options.prop, undefined)
  })
})

each([getInstanceInfo, getStaticInfo], ({ title }, getValues) => {
  const { errorInfo } = getValues({ ErrorClasses, methodOpts: true })

  test(`errorInfo returns method options | ${title}`, (t) => {
    t.true(errorInfo(new TestError('test')).options.prop)
  })

  test(`errorInfo method options have more priority than instance options | ${title}`, (t) => {
    t.true(errorInfo(new TestError('test', { prop: false })).options.prop)
  })
})

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    const OtherErrorClasses = defineOpts({ prop: true })
    const { errorInfo } = getValues({ ErrorClasses: OtherErrorClasses })

    test(`errorInfo returns global and class options | ${title}`, (t) => {
      t.true(errorInfo(new OtherErrorClasses.TestError('test')).options.prop)
    })

    test(`errorInfo global and class options have less priority than instance options | ${title}`, (t) => {
      t.false(
        errorInfo(new OtherErrorClasses.TestError('test', { prop: false }))
          .options.prop,
      )
    })
  },
)

each(
  [getInstanceInfo, getStaticInfo],
  [defineGlobalOpts, defineClassOpts],
  ({ title }, getValues, defineOpts) => {
    const OtherErrorClasses = defineOpts({ prop: false })
    const { errorInfo } = getValues({
      ErrorClasses: OtherErrorClasses,
      methodOpts: true,
    })

    test(`errorInfo global and class options have less priority than method options | ${title}`, (t) => {
      t.true(errorInfo(new OtherErrorClasses.TestError('test')).options.prop)
    })
  },
)
