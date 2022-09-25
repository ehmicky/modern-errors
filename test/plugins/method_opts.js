import test from 'ava'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { AnyError } = defineClassOpts()
test('plugin.staticMethods can pass method options', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts({ prop: false })
  t.true(TestAnyError.getProp(true).options.prop)
})

test('plugin.staticMethods merges method options', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts({
    prop: { one: false, two: { three: false }, five: false },
  })
  t.deepEqual(
    TestAnyError.getProp({ one: true, two: { three: true }, four: true })
      .options.prop,
    { one: true, two: { three: true }, four: true, five: false },
  )
})

test('plugin.staticMethods does not forward method options', (t) => {
  t.deepEqual(AnyError.getProp(0, true).args, [0])
})

test('plugin.staticMethods pass last argument as method options if plugin.isOptions() is undefined', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts({}, [
    { ...TEST_PLUGIN, isOptions: undefined },
  ])
  t.deepEqual(TestAnyError.getProp(0, true).args, [0])
})

test('plugin.staticMethods only pass method options if plugin.isOptions() returns true', (t) => {
  t.deepEqual(AnyError.getProp(0).args, [0])
})

test('plugin.staticMethods can have no arguments', (t) => {
  t.deepEqual(AnyError.getProp().args, [])
})
