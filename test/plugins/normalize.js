import test from 'ava'
import { each } from 'test-each'

import {
  defineSimpleClass,
  defineGlobalOpts,
  defineClassOpts,
  TEST_PLUGIN,
} from '../helpers/main.js'

const { TestError } = defineSimpleClass()

test('plugin.normalize() is optional', (t) => {
  const { InputError } = defineClassOpts({}, [
    { ...TEST_PLUGIN, normalize: undefined },
  ])
  t.true(new InputError('test', { prop: true }).set.options)
})

test('plugin.normalize() is called with no context', (t) => {
  t.is(new TestError('test', { prop: true }).set.options.context, undefined)
})

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`plugin.normalize() exceptions are thrown right away for global and class options | ${title}`, (t) => {
    t.throws(defineOpts.bind(undefined, { prop: 'invalid' }))
  })
})

test('plugin.normalize() exceptions are not thrown right away for instance options', (t) => {
  t.throws(() => new TestError('test', { prop: 'invalid' }))
})
