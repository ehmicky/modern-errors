import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getMixInfo,
  getStaticInfo,
} from '../../../helpers/info.test.js'
import { ErrorSubclasses } from '../../../helpers/plugin.test.js'

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getMixInfo, getStaticInfo],
  ({ title }, ErrorClass, getInfo) => {
    test(`errorInfo returns instance options | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass)
      t.true(errorInfo(new ErrorClass('test', { prop: true })).options.prop)
    })

    test(`errorInfo returns class options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: true })
      const { errorInfo } = getInfo(ErrorClass)
      const error = new TestError('test')
      t.true(errorInfo(error).options.prop)
    })

    test(`errorInfo class options have less priority than instance options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: true })
      const { errorInfo } = getInfo(TestError)
      t.false(errorInfo(new TestError('test', { prop: false })).options.prop)
    })
  },
)

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getMixInfo],
  ({ title }, ErrorClass, getInfo) => {
    test(`errorInfo ignores parent instance options | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass, { prop: true })
      t.is(errorInfo(new ErrorClass('test')).options.prop, undefined)
    })
  },
)

each(
  ErrorSubclasses,
  [getInstanceInfo, getMixInfo, getStaticInfo],
  ({ title }, ErrorClass, getInfo) => {
    test(`errorInfo returns method options | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass, {}, true)
      t.true(errorInfo(new ErrorClass('test')).options.prop)
    })

    test(`errorInfo method options have more priority than instance options | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass, {}, true)
      t.true(errorInfo(new ErrorClass('test', { prop: false })).options.prop)
    })

    test(`errorInfo class options have less priority than method options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: false })
      const { errorInfo } = getInfo(TestError, {}, true)
      t.true(errorInfo(new TestError('test')).options.prop)
    })
  },
)
