import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`Instance options have priority over global or class options| ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: false })
    t.true(new TestError('test', { prop: true }).set.options.prop)
  })
})

test('undefined instance options are ignored', (t) => {
  const { TestError } = defineClassOpts({ prop: true })
  t.true(new TestError('test', { prop: undefined }).set.options.prop)
})

test('Object instance options are shallowly merged', (t) => {
  const { TestError } = defineClassOpts({
    prop: { one: false, two: { three: false }, five: false },
  })
  t.deepEqual(
    new TestError('test', {
      prop: { one: true, two: { three: true }, four: true },
    }).set.options.prop,
    { one: true, two: { three: true }, four: true, five: false },
  )
})
