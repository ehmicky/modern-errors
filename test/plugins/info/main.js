import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../../helpers/info.js'
import { getClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

const { ErrorSubclasses } = getClasses({ plugins: [TEST_PLUGIN] })

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClass | ${title}`, (t) => {
      t.is(getValues(ErrorClass).ErrorClass, ErrorClass)
    })

    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
      t.true(Array.isArray(getValues(ErrorClass).ErrorClasses))
    })

    test(`plugin.properties|instanceMethods|staticMethods cannot modify ErrorClasses | ${title}`, (t) => {
      const { ErrorClasses: ErrorClassesInfo } = getValues(ErrorClass)
      const { length } = ErrorClassesInfo
      // eslint-disable-next-line fp/no-mutating-methods
      ErrorClassesInfo.push(true)
      t.is(ErrorClass.getProp().ErrorClasses.length, length)
    })

    test(`plugin.properties|instanceMethods|staticMethods cannot modify options | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      getValues(ErrorClass).options.prop = false
      t.is(ErrorClass.getProp().options.prop, undefined)
    })

    test(`plugin.properties|instanceMethods|staticMethods has "full: true" with getOptions() | ${title}`, (t) => {
      t.true(getValues(ErrorClass).options.full)
    })

    test(`plugin.properties|instanceMethods|staticMethods is passed errorInfo | ${title}`, (t) => {
      t.is(typeof getValues(ErrorClass).errorInfo, 'function')
    })

    test(`plugin.properties|instanceMethods|staticMethods get the class options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: true })
      t.true(getValues(TestError).options.prop)
    })
  },
)

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.properties gets the instance options | ${title}`, (t) => {
    t.true(new ErrorClass('test', { prop: true }).properties.options.prop)
  })

  test(`plugin.instanceMethods gets the instance options | ${title}`, (t) => {
    t.true(new ErrorClass('test', { prop: true }).getInstance().options.prop)
  })

  test(`plugin.properties gets the error | ${title}`, (t) => {
    t.true(new ErrorClass('test').properties.error instanceof Error)
  })

  test(`plugin.instanceMethods gets the error | ${title}`, (t) => {
    t.true(new ErrorClass('test').getInstance().error instanceof Error)
  })
})
