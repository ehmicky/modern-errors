import test from 'ava'
import { each } from 'test-each'

import {
  defineSimpleClass,
  defineClassOpts,
  defineGlobalOpts,
} from '../helpers/main.js'

const { TestError, AnyError, UnknownError } = defineSimpleClass()

test('Passes error to plugin.unset()', (t) => {
  const cause = new TestError('causeMessage')
  t.true(new TestError('test', { cause }).unset.error instanceof Error)
})

test('Passes previous instance options to plugin.unset()', (t) => {
  const cause = new TestError('causeMessage', { prop: false })
  t.false(new TestError('test', { cause, prop: true }).unset.options.prop)
})

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`Passes previous class or global options to plugin.unset() | ${title}`, (t) => {
    const { InputError } = defineOpts({ prop: false })
    t.false(
      new InputError('test', {
        cause: new InputError('causeMessage'),
        prop: true,
      }).unset.options.prop,
    )
  })
})

test('plugin.unset() is called with no context', (t) => {
  const cause = new TestError('causeMessage')
  t.is(new TestError('test', { cause }).unset.context, undefined)
})

test('plugin.unset() is not called without a cause', (t) => {
  t.false('unset' in new TestError('test'))
})

test('plugin.unset() is not called without a cause with a known type', (t) => {
  t.false('unset' in new TestError('test', { cause: '' }))
})

test('plugin.unset() is called with a cause with a known type', (t) => {
  const cause = new TestError('causeMessage')
  t.true('unset' in new TestError('test', { cause }))
})

test('plugin.unset() is passed AnyError', (t) => {
  const cause = new TestError('causeMessage')
  t.is(new TestError('test', { cause }).unset.AnyError, AnyError)
})

test('plugin.unset() is passed KnownClasses', (t) => {
  const cause = new TestError('causeMessage')
  t.deepEqual(new TestError('test', { cause }).unset.KnownClasses, {
    TestError,
    UnknownError,
  })
})
