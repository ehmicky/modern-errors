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
    t.deepEqual(error.properties.options.prop, {
      one: true,
      two: { three: true },
      five: false,
      four: true,
    })
  })
})

test('plugin.properties() is optional', (t) => {
  const { TestError } = defineClassOpts({}, {}, [
    { ...TEST_PLUGIN, properties: undefined },
  ])
  t.false('properties' in new TestError('test'))
})

each(
  [({ AnyError }) => AnyError, ({ ErrorClasses }) => ErrorClasses.TestError],
  ({ title }, getClass) => {
    test(`plugin.properties() can wrap error itself | ${title}`, (t) => {
      const prefix = 'prefix: '
      const message = 'test'
      const { TestError } = defineClassOpts({}, {}, [
        {
          ...TEST_PLUGIN,
          properties({ error, ...info }) {
            const ErrorClass = getClass(info)
            const wrappedError = error.message.startsWith(prefix)
              ? error
              : new ErrorClass(prefix, { cause: error })
            return { wrappedError }
          },
        },
      ])
      t.is(new TestError(message).wrappedError.message, `${prefix}${message}`)
    })
  },
)
