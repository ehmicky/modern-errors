import { emitWarning } from 'process'
import { promisify } from 'util'

import test from 'ava'
import sinon from 'sinon'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import PROCESS_PLUGIN from '../../src/core_plugins/process.js'
import { defineClassOpts } from '../helpers/main.js'

// TODO: use `timers/promises` after dropping support for Node <15
const pSetInterval = promisify(setInterval)

const { AnyError } = defineClassOpts({}, {}, [PROCESS_PLUGIN])

each(
  [true, { unknown: true }, { exit: 'true' }, { onError: true }],
  ({ title }, options) => {
    test.serial(`Options are validated | ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      t.throws(() => AnyError.logProcess(options))
    })
  },
)

test.serial('Handles process errors', async (t) => {
  const onError = sinon.stub()
  const stopLogging = AnyError.logProcess({ onError })
  const error = new Error('test')
  emitWarning(error)
  await pSetInterval()
  t.deepEqual(onError.args, [[error, 'warning']])
  stopLogging()
})
