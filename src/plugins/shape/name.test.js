import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../../helpers/main.test.js'
import { TEST_PLUGIN } from '../../helpers/plugin.test.js'

each(
  ErrorClasses,
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
  ({ title }, ErrorClass, name) => {
    test(`Should validate plugin.name | ${title}`, (t) => {
      t.throws(
        ErrorClass.subclass.bind(undefined, 'TestError', {
          plugins: [{ ...TEST_PLUGIN, name }],
        }),
      )
    })
  },
)
