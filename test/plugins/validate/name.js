import test from 'ava'
import { each } from 'test-each'

import { defineGlobalOpts } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

each(
  [
    undefined,
    true,
    '',
    'testProp',
    'test-prop',
    'test_prop',
    '0test',
    'cause',
    'errors',
    'custom',
    'wrap',
    'constructorArgs',
  ],
  ({ title }, name) => {
    test(`Should validate plugin.name | ${title}`, (t) => {
      t.throws(defineGlobalOpts.bind(undefined, {}, [{ ...TEST_PLUGIN, name }]))
    })
  },
)
