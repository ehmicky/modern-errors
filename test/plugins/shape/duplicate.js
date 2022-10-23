import test from 'ava'

import { defineGlobalOpts } from '../../helpers/main.js'

test('plugin.staticMethods cannot be defined twice by different plugins', (t) => {
  t.throws(
    defineGlobalOpts.bind(undefined, {}, [
      { name: 'one', staticMethods: { one() {} } },
      { name: 'two', staticMethods: { one() {} } },
    ]),
  )
})

test('plugin.instanceMethods cannot be defined twice by different plugins', (t) => {
  t.throws(
    defineGlobalOpts.bind(undefined, {}, [
      { name: 'one', instanceMethods: { one() {} } },
      { name: 'two', instanceMethods: { one() {} } },
    ]),
  )
})
