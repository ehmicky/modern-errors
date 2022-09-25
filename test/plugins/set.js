import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { TestError, AnyError } = defineClassOpts()

test('Passes error to plugin.set()', (t) => {
  t.true(new TestError('test').set.error instanceof Error)
})

test('Passes new instance options to plugin.set()', (t) => {
  const cause = new TestError('causeMessage', { prop: false })
  t.true(new TestError('test', { cause, prop: true }).set.options.prop)
})

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`Passes new class options to plugin.set() | ${title}`, (t) => {
    const { TestError: OtherTestError } = defineOpts({ prop: false })
    const cause = new OtherTestError('causeMessage')
    t.true(new OtherTestError('test', { cause, prop: true }).set.options.prop)
  })
})

test('plugin.set() has "full: true" with normalize()', (t) => {
  t.true(new TestError('test').set.options.full)
})

test('Passes all plugins options to plugin.set()', (t) => {
  t.deepEqual(new TestError('test', { prop: true }).set.allOptions, {
    prop: true,
  })
})

test('plugin.set() is optional', (t) => {
  const { TestError: OtherTestError } = defineClassOpts({}, {}, [
    { ...TEST_PLUGIN, set: undefined, unset: undefined },
  ])
  t.false('set' in new OtherTestError('test'))
})

test('plugin.set() is called with no context', (t) => {
  t.is(new TestError('test').set.context, undefined)
})

test('plugin.set() is passed AnyError', (t) => {
  t.is(new TestError('test').set.AnyError, AnyError)
})
