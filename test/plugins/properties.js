import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`Object instance options are shallowly merged to class and global options | ${title}`, (t) => {
    const { TestError } = defineOpts({
      prop: { one: false, two: { three: false }, five: false },
    })
    const error = new TestError('test', {
      prop: { one: true, two: { three: true }, four: true },
    })
    t.deepEqual(error.set.options.prop, {
      one: true,
      two: { three: true },
      five: false,
      four: true,
    })
  })
})

test('plugin.set() is optional', (t) => {
  const { TestError } = defineClassOpts({}, {}, [
    { ...TEST_PLUGIN, set: undefined },
  ])
  t.false('set' in new TestError('test'))
})
