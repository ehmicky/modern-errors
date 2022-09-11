import test from 'ava'

import { defineSimpleClass, defineGlobalOpts } from '../helpers/main.js'

const { AnyError, TestError, UnknownError } = defineSimpleClass()

test('plugin.staticMethods are set on AnyError', (t) => {
  t.is(typeof AnyError.getProp, 'function')
})

test('plugin.staticMethods forward argument', (t) => {
  t.deepEqual(AnyError.getProp(0, 1).args, [0, 1])
})

test('plugin.staticMethods have no context', (t) => {
  t.is(AnyError.getProp().context, undefined)
})

test('plugin.staticMethods is passed AnyError', (t) => {
  t.is(AnyError.getProp().AnyError, AnyError)
})

test('plugin.staticMethods is passed KnownClasses', (t) => {
  t.deepEqual(AnyError.getProp().KnownClasses, { TestError, UnknownError })
})

test('plugin.staticMethods are passed the normalized global options', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts({ prop: true })
  t.true(TestAnyError.getProp().options.prop)
})
