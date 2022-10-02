import test from 'ava'
import { each } from 'test-each'

import { defineGlobalOpts, defineClassOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { TestError } = defineClassOpts()
const { TestError: NoOptsTestError } = defineClassOpts({}, {}, [
  { ...TEST_PLUGIN, getOptions: undefined },
])

test('plugin.getOptions() forbids options by default', (t) => {
  t.throws(() => new NoOptsTestError('test', { prop: true }))
})

each([undefined, {}, { prop: undefined }], ({ title }, opts) => {
  test(`plugin.getOptions() allows undefined options by default | ${title}`, (t) => {
    t.is(new NoOptsTestError('test', opts).properties.options, undefined)
  })
})

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`plugin.getOptions() exceptions are thrown right away for global and class options | ${title}`, (t) => {
    t.throws(defineOpts.bind(undefined, { prop: 'invalid' }))
  })
})

test('plugin.getOptions() exceptions are not thrown right away for instance options', (t) => {
  t.throws(() => new TestError('test', { prop: 'invalid' }))
})
