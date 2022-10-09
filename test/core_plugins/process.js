import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import PROCESS_PLUGIN from '../../src/core_plugins/process.js'
import { defineClassOpts } from '../helpers/main.js'

const { AnyError } = defineClassOpts({}, {}, [PROCESS_PLUGIN])

each(
  [true, { unknown: true }, { exit: 'true' }, { onError: true }],
  ({ title }, options) => {
    test(`Options are validated | ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      t.throws(() => AnyError.logProcess(options))
    })
  },
)
