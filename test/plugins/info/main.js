import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../../helpers/info.js'
import { getPluginClasses } from '../../helpers/main.js'

const { ErrorSubclasses } = getPluginClasses()
const { ErrorSubclasses: OtherSubclasses } = getPluginClasses()

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClass | ${title}`, (t) => {
      t.is(getValues(ErrorClass).ErrorClass, ErrorClass)
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

each(
  OtherSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
      t.deepEqual(getValues(ErrorClass).ErrorClasses, [
        ErrorClass,
        // eslint-disable-next-line max-nested-callbacks
        ...OtherSubclasses.filter((ErrorSubclass) =>
          Object.prototype.isPrototypeOf.call(ErrorClass, ErrorSubclass),
        ),
      ])
    })
  },
)

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`plugin.properties|instanceMethods gets the instance options | ${title}`, (t) => {
      t.true(getValues(ErrorClass, { prop: true }).options.prop)
    })

    test(`plugin.properties|instanceMethods gets the error | ${title}`, (t) => {
      t.true(getValues(ErrorClass, { prop: true }).error instanceof Error)
    })
  },
)
