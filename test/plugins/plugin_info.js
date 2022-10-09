import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../helpers/info.js'
import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

const ErrorClasses = defineClassOpts()
const { TestError, UnknownError, AnyError } = ErrorClasses

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, getValues) => {
    test(`plugin.properties|instanceMethods|staticMethods is passed AnyError | ${title}`, (t) => {
      t.is(getValues({ ErrorClasses }).AnyError, AnyError)
    })

    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
      t.deepEqual(getValues({ ErrorClasses }).ErrorClasses, {
        TestError,
        UnknownError,
      })
    })

    test(`plugin.properties|instanceMethods|staticMethods cannot modify ErrorClasses | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      getValues({ ErrorClasses }).ErrorClasses.prop = true
      t.false('prop' in AnyError.getProp().ErrorClasses)
    })

    test(`plugin.properties|instanceMethods|staticMethods cannot modify options | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      getValues({ ErrorClasses }).options.prop = false
      t.is(AnyError.getProp().options.prop, undefined)
    })

    test(`plugin.properties|instanceMethods|staticMethods has "full: true" with getOptions() | ${title}`, (t) => {
      t.true(getValues({ ErrorClasses }).options.full)
    })

    test(`plugin.properties|instanceMethods|staticMethods is passed errorInfo | ${title}`, (t) => {
      t.is(typeof getValues({ ErrorClasses }).errorInfo, 'function')
    })
  },
)

each(
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, getValues) => {
    test(`plugin.properties|instanceMethods|staticMethods get the global options | ${title}`, (t) => {
      const OtherErrorClasses = defineGlobalOpts({ prop: true })
      t.true(getValues({ ErrorClasses: OtherErrorClasses }).options.prop)
    })
  },
)

each([getPropertiesInfo, getInstanceInfo], ({ title }, getValues) => {
  test(`plugin.properties|instanceMethods get the class options | ${title}`, (t) => {
    const OtherErrorClasses = defineClassOpts({ prop: true })
    t.true(getValues({ ErrorClasses: OtherErrorClasses }).options.prop)
  })

  test(`plugin.properties|instanceMethods get "showStack" | ${title}`, (t) => {
    t.false(getValues({ ErrorClasses }).showStack)
  })
})

test('plugin.properties gets the instance options', (t) => {
  const error = new TestError('test', { prop: true })
  t.true(error.properties.options.prop)
})

test('plugin.instanceMethods gets the instance options', (t) => {
  const error = new TestError('test', { prop: true })
  t.true(error.getInstance().options.prop)
})

test('plugin.properties gets the error', (t) => {
  t.true(new TestError('test').properties.error instanceof Error)
})

test('plugin.instanceMethods gets the error', (t) => {
  t.true(new TestError('test').getInstance().error instanceof Error)
})
