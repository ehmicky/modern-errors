import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`Instance options have priority over global or class options| ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: false })
    t.true(new TestError('test', { prop: true }).properties.options.prop)
  })
})

test('undefined instance options are ignored', (t) => {
  const { TestError } = defineClassOpts({ prop: true })
  t.true(new TestError('test', { prop: undefined }).properties.options.prop)
})
