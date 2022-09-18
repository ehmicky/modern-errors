import test from 'ava'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

const { hasOwnProperty: hasOwn } = Object.prototype

const { TestError, AnyError } = defineClassOpts()

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

test('plugin.instanceMethods forward argument', (t) => {
  t.deepEqual(new TestError('message').getInstance(0, 1).args, [0, 1])
})

test('plugin.instanceMethods have no context', (t) => {
  t.is(new TestError('message').getInstance().context, undefined)
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

test('plugin.instanceMethods are passed the normalized global options', (t) => {
  const { TestError: OtherTestError } = defineGlobalOpts({ prop: true })
  t.true(new OtherTestError('message').getInstance().options.prop)
})

test('plugin.instanceMethods are passed AnyError', (t) => {
  t.is(new TestError('message').getInstance().AnyError, AnyError)
})

test('plugin.instanceMethods cannot be defined twice by different plugins', (t) => {
  t.throws(
    defineGlobalOpts.bind(undefined, {}, [
      { name: 'one', instanceMethods: { one() {} } },
      { name: 'two', instanceMethods: { one() {} } },
    ]),
  )
})
