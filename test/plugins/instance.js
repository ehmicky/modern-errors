import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

const { hasOwnProperty: hasOwn } = Object.prototype

const { TestError } = defineClassOpts()

test('plugin.instanceMethods are set on known errors', (t) => {
  t.is(typeof new TestError('message').getInstance, 'function')
})

test('plugin.instanceMethods are inherited', (t) => {
  t.false(hasOwn.call(new TestError('message'), 'getInstance'))
})

test('plugin.instanceMethods are not enumerable', (t) => {
  t.false(
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(TestError).prototype,
      'getInstance',
    ).enumerable,
  )
})

test('plugin.instanceMethods are passed the error', (t) => {
  const error = new TestError('message')
  t.is(error.getInstance().error, error)
})

test('plugin.instanceMethods are passed the normalized instance options', (t) => {
  const error = new TestError('message', { prop: true })
  t.true(error.getInstance().options.prop)
})

test('plugin.instanceMethods are passed the normalized class options', (t) => {
  const { TestError: OtherTestError } = defineClassOpts({ prop: true })
  t.true(new OtherTestError('message').getInstance().options.prop)
})

test('plugin.instanceMethods are passed the raw instance options of all plugins', (t) => {
  const error = new TestError('message', { prop: true })
  t.deepEqual(error.getInstance().allOptions, { prop: true })
})

test('plugin.instanceMethods cannot modify "allOptions"', (t) => {
  const error = new TestError('message', { prop: { one: true } })
  // eslint-disable-next-line fp/no-mutation
  error.getInstance().allOptions.prop.one = false
  t.true(error.getInstance().allOptions.prop.one)
})

each(
  [
    ...new Set([
      ...Reflect.ownKeys(Error.prototype),
      ...Reflect.ownKeys(Object.prototype),
    ]),
  ],
  ({ title }, propName) => {
    test(`plugin.instanceMethods cannot redefine native Error.prototype.* | ${title}`, (t) => {
      t.throws(
        defineGlobalOpts.bind(undefined, {}, [
          { name: 'one', instanceMethods: { [propName]() {} } },
        ]),
      )
    })
  },
)
