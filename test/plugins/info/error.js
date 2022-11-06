import test from 'ava'
import { each } from 'test-each'

import {
  getPropertiesInfo,
  getInstanceInfo,
  getStaticInfo,
} from '../../helpers/info.js'
import { getClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'
import { getUnknownErrors } from '../../helpers/unknown.js'

const { ErrorSubclasses } = getClasses({ plugins: [TEST_PLUGIN] })

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  getUnknownErrors(),
  // eslint-disable-next-line max-params
  ({ title }, ErrorClass, getValues, getUnknownError) => {
    test(`errorInfo throws on unknown errors | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass)
      t.throws(errorInfo.bind(undefined, getUnknownError()))
    })

    test(`errorInfo returns ErrorClass | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass)
      t.is(errorInfo(new ErrorClass('test')).ErrorClass, ErrorClass)
    })
  },
)

each(
  ErrorSubclasses,
  [(error) => error.properties, (error) => error.getInstance()],
  ({ title }, ErrorClass, getSpecifics) => {
    test(`errorInfo can be applied on error itself | ${title}`, (t) => {
      const error = new ErrorClass('test', { prop: true })
      const { errorInfo } = getSpecifics(error)
      t.true(errorInfo(error).options.prop)
    })
  },
)

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`errorInfo returns instance options | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass)
      t.true(errorInfo(new ErrorClass('test', { prop: true })).options.prop)
    })

    test(`errorInfo returns class options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: true })
      const { errorInfo } = getValues(TestError)
      t.true(errorInfo(new TestError('test')).options.prop)
    })

    test(`errorInfo class options have less priority than instance options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: true })
      const { errorInfo } = getValues(TestError)
      t.false(errorInfo(new TestError('test', { prop: false })).options.prop)
    })
  },
)

each(
  ErrorSubclasses,
  [getPropertiesInfo, getInstanceInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`errorInfo ignores parent instance options | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass, { prop: true })
      t.is(errorInfo(new ErrorClass('test')).options.prop, undefined)
    })
  },
)

each(
  ErrorSubclasses,
  [getInstanceInfo, getStaticInfo],
  ({ title }, ErrorClass, getValues) => {
    test(`errorInfo returns method options | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass, {}, true)
      t.true(errorInfo(new ErrorClass('test')).options.prop)
    })

    test(`errorInfo method options have more priority than instance options | ${title}`, (t) => {
      const { errorInfo } = getValues(ErrorClass, {}, true)
      t.true(errorInfo(new ErrorClass('test', { prop: false })).options.prop)
    })

    test(`errorInfo global and class options have less priority than method options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: false })
      const { errorInfo } = getValues(TestError, {}, true)
      t.true(errorInfo(new TestError('test')).options.prop)
    })
  },
)
