import test from 'ava'

import {
  defineClassOpts,
  defineGlobalOpts,
  createAnyError,
} from '../helpers/main.js'

const { AnyError } = defineClassOpts()

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

test('plugin.staticMethods are passed the normalized global options', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts({ prop: true })
  t.true(TestAnyError.getProp().options.prop)
})

test('plugin.staticMethods cannot be called before AnyError.subclass()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(TestAnyError.getProp)
})

test('plugin.staticMethods cannot be defined twice by different plugins', (t) => {
  t.throws(
    defineGlobalOpts.bind(undefined, {}, [
      { name: 'one', staticMethods: { one() {} } },
      { name: 'two', staticMethods: { one() {} } },
    ]),
  )
})
