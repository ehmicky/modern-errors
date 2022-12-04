import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getMixInfo,
  getStaticInfo,
} from '../../helpers/info.test.js'
import { ErrorSubclasses } from '../../helpers/plugin.test.js'
import { getUnknownErrors } from '../../helpers/unknown.test.js'

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getMixInfo, getStaticInfo],
  getUnknownErrors(),
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, getInfo, getUnknownError) => {
    test(`errorInfo normalizes unknown errors | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass)
      const info = errorInfo(getUnknownError())
      t.is(info.error.constructor, ErrorClass)
      t.is(info.ErrorClass, ErrorClass)
    })
  },
)

each(
  ErrorSubclasses,
  [(error) => error.properties, (error) => error.getInstance()],
  ({ title }, ErrorClass, getSpecifics) => {
    test(`errorInfo can be applied on error itself | ${title}`, (t) => {
      const error = new ErrorClass('test')
      const { errorInfo } = getSpecifics(error)
      t.is(errorInfo(error).error, error)
    })
  },
)

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getMixInfo, getStaticInfo],
  ({ title }, ErrorClass, getInfo) => {
    test(`errorInfo returns error | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass)
      const error = new ErrorClass('test')
      t.is(errorInfo(error).error, error)
    })

    test(`errorInfo returns ErrorClass | ${title}`, (t) => {
      const { errorInfo } = getInfo(ErrorClass)
      t.is(errorInfo(new ErrorClass('test')).ErrorClass, ErrorClass)
    })

    test(`errorInfo returns ErrorClass of subclass | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError')
      const { errorInfo } = getInfo(ErrorClass)
      t.is(errorInfo(new TestError('test')).ErrorClass, TestError)
    })

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
