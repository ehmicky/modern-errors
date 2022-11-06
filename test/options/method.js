import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { ErrorSubclasses } = getClasses()
const { ErrorSubclasses: PluginErrorClasses } = getClasses({
  plugins: [TEST_PLUGIN],
})

const callStaticMethod = function (ErrorClass, ...args) {
  return ErrorClass.getProp(...args)
}

const callInstanceMethod = function (ErrorClass, ...args) {
  return new ErrorClass('message').getInstance(...args)
}

each(
  PluginErrorClasses,
  [callStaticMethod, callInstanceMethod],
  ({ title }, ErrorClass, callMethod) => {
    test(`plugin methods can pass method options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', { prop: false })
      t.true(callMethod(TestError, true).options.prop)
    })

    test(`plugin methods merge method options | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', {
        prop: { one: false, two: { three: false }, five: false },
      })
      t.deepEqual(
        callMethod(TestError, { one: true, two: { three: true }, four: true })
          .options.prop,
        { one: true, two: { three: true }, four: true, five: false },
      )
    })

    test(`plugin methods pass last argument as method option if plugin.isOptions() returns true | ${title}`, (t) => {
      t.deepEqual(callMethod(ErrorClass, 0, true).args, [0])
    })

    test(`plugin methods pass last argument as method option if plugin.isOptions() returns false | ${title}`, (t) => {
      t.deepEqual(callMethod(ErrorClass, 0, 1).args, [0, 1])
    })

    test(`plugin methods can have no arguments | ${title}`, (t) => {
      t.deepEqual(callMethod(ErrorClass).args, [])
    })
  },
)

each(
  ErrorSubclasses,
  [callStaticMethod, callInstanceMethod],
  ({ title }, ErrorClass, callMethod) => {
    test(`plugin methods pass last argument as method options if plugin.isOptions() is undefined | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', {
        plugins: [{ ...TEST_PLUGIN, isOptions: undefined }],
      })
      t.deepEqual(callMethod(TestError, 0, true).args, [0])
    })

    test(`plugin methods do not pass last argument as method options if plugin.isOptions() and getOptions() are both undefined | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', {
        plugins: [
          { ...TEST_PLUGIN, isOptions: undefined, getOptions: undefined },
        ],
      })
      t.deepEqual(callMethod(TestError, 0, true).args, [0, true])
    })

    test(`plugin methods throw if plugin.isOptions() does not return a boolean | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError', {
        plugins: [{ ...TEST_PLUGIN, isOptions() {} }],
      })
      t.throws(callMethod.bind(undefined, TestError, 0))
    })
  },
)
