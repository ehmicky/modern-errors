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

const { propertyIsEnumerable: isEnum } = Object.prototype

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getInfo) => {
    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClass | ${title}`, (t) => {
      t.is(getInfo(ErrorClass).ErrorClass, ErrorClass)
    })

    test(`plugin.properties|instanceMethods|staticMethods cannot modify ErrorClasses | ${title}`, (t) => {
      const { ErrorClasses: ErrorClassesInfo } = getInfo(ErrorClass)
      const { length } = ErrorClassesInfo
      // eslint-disable-next-line fp/no-mutating-methods
      ErrorClassesInfo.push(true)
      t.is(ErrorClass.getProp().ErrorClasses.length, length)
    })

    test(`plugin.properties|instanceMethods|staticMethods cannot modify options | ${title}`, (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      getInfo(ErrorClass).options.prop = false
      t.is(ErrorClass.getProp().options.prop, undefined)
    })

    test(`plugin.properties|instanceMethods|staticMethods has "full: true" with getOptions() | ${title}`, (t) => {
      t.true(getInfo(ErrorClass).options.full)
    })

    test(`plugin.properties|instanceMethods|staticMethods is passed errorInfo | ${title}`, (t) => {
      t.is(typeof getInfo(ErrorClass).errorInfo, 'function')
    })

    test(`plugin.properties|instanceMethods|staticMethods get the class options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: true })
      t.true(getInfo(TestError).options.prop)
    })

    test(`plugin.properties|instanceMethods|staticMethods get the instancesData | ${title}`, (t) => {
      const info = getInfo(ErrorClass)
      t.false(isEnum.call(info, 'instancesData'))
      const instanceOpts = { prop: true }
      const error = new ErrorClass('message', instanceOpts)
      t.deepEqual(info.instancesData.get(error).pluginsOpts, instanceOpts)
    })
  },
)

each(
  OtherSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getInfo) => {
    test(`plugin.properties|instanceMethods|staticMethods is passed ErrorClasses | ${title}`, (t) => {
      t.deepEqual(getInfo(ErrorClass).ErrorClasses, [
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
  ({ title }, ErrorClass, getInfo) => {
    test(`plugin.properties|instanceMethods gets the instance options | ${title}`, (t) => {
      t.true(getInfo(ErrorClass, { prop: true }).options.prop)
    })

    test(`plugin.properties|instanceMethods gets the error | ${title}`, (t) => {
      t.true(getInfo(ErrorClass, { prop: true }).error instanceof Error)
    })
  },
)
