import test from 'ava'
import { each } from 'test-each'

import {
  defineClassOpts,
  defineGlobalOpts,
  createAnyError,
} from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { AnyError } = defineClassOpts()

test('plugin.staticMethods are set on AnyError', (t) => {
  t.is(typeof AnyError.getProp, 'function')
})

test('plugin.staticMethods forward argument', (t) => {
  t.deepEqual(AnyError.getProp(0, 1).args, [0, 1])
})

test('plugin.staticMethods is passed AnyError', (t) => {
  t.is(AnyError.getProp().AnyError, AnyError)
})

test('plugin.staticMethods are passed the normalized global options', (t) => {
  const { AnyError: TestAnyError } = defineGlobalOpts({ prop: true })
  t.true(TestAnyError.getProp().options.prop)
})

test('plugin.staticMethods have "full: true" with normalize()', (t) => {
  t.true(AnyError.getProp().options.full)
})

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

test('plugin.staticMethods cannot be called before AnyError.subclass()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(TestAnyError.getProp)
})

each(
  [
    'subclass',
    'normalize',
    ...new Set([...Reflect.ownKeys(Error), ...Reflect.ownKeys(Function)]),
  ],
  ({ title }, propName) => {
    test(`plugin.staticMethods cannot redefine native Error.* | ${title}`, (t) => {
      t.throws(
        defineGlobalOpts.bind(undefined, {}, [
          { name: 'one', staticMethods: { [propName]() {} } },
        ]),
      )
    })
  },
)
