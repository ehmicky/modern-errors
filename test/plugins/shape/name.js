import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

const { ErrorClasses } = getClasses()

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
        ErrorClass.subclass.bind(undefined, 'TestError', [
          { ...TEST_PLUGIN, name },
        ]),
      )
    })
  },
)
