import test from 'ava'
import { each } from 'test-each'

import { getClasses, getPluginClasses } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { ErrorSubclasses } = getPluginClasses()
const { ErrorClasses } = getClasses()

const { hasOwnProperty: hasOwn } = Object.prototype

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.instanceMethods are set on known errors | ${title}`, (t) => {
    t.is(typeof new ErrorClass('message').getInstance, 'function')
  })

  test(`plugin.instanceMethods are inherited | ${title}`, (t) => {
    t.false(hasOwn.call(new ErrorClass('message'), 'getInstance'))
  })

  test(`plugin.instanceMethods are not enumerable | ${title}`, (t) => {
    t.false(
      Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'getInstance')
        .enumerable,
    )
  })

  test(`plugin.instanceMethods validate the context | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.notThrows(error.getInstance.bind(error))
    t.throws(error.getInstance)
  })

  test(`plugin.instanceMethods are passed the error | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.is(error.getInstance().error, error)
  })

  test(`plugin.instanceMethods are passed the normalized instance options | ${title}`, (t) => {
    const error = new ErrorClass('message', { prop: true })
    t.true(error.getInstance().options.prop)
  })

  test(`plugin.instanceMethods are passed the normalized class options | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', { prop: true })
    t.true(new TestError('message').getInstance().options.prop)
  })
})

each(
  ErrorClasses,
  [
    ...new Set([
      ...Reflect.ownKeys(Error.prototype),
      ...Reflect.ownKeys(Object.prototype),
    ]),
  ],
  ({ title }, ErrorClass, propName) => {
    test(`plugin.instanceMethods cannot redefine native Error.prototype.* | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, instanceMethods: { [propName]() {} } }],
        }),
      )
    })
  },
)
