import test from 'ava'
import modernErrors from 'modern-errors'

import {
  defineSimpleClass,
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

test('plugin.normalize() exceptions are thrown right away for global options', (t) => {
  t.throws(
    modernErrors.bind(
      undefined,
      { AnyError: { prop: 'invalid' }, UnknownError: { prop: '' } },
      [TEST_PLUGIN],
    ),
  )
})

test('plugin.normalize() exceptions are thrown right away for class options', (t) => {
  t.throws(defineClassOpts.bind(undefined, { prop: 'invalid' }))
})

test('plugin.normalize() exceptions are not thrown right away for instance options', (t) => {
  t.throws(() => new TestError('test', { prop: 'invalid' }))
})
