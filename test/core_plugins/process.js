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

const { UnknownError, AnyError } = defineClassOpts({}, {}, [PROCESS_PLUGIN])

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
  const onError = sinon.spy()
  const stopLogging = AnyError.logProcess({ onError })
  const error = new UnknownError('test')
  emitWarning(error)
  await pSetInterval()
  t.deepEqual(onError.args, [[error, 'warning']])
  stopLogging()
})

// eslint-disable-next-line no-restricted-globals
const stub = sinon.stub(console, 'error')

test.serial('Prints on the console by default', async (t) => {
  const stopLogging = AnyError.logProcess()
  const error = new UnknownError('test')
  emitWarning(error)
  await pSetInterval()
  t.is(stub.args[0][0], error)
  stopLogging()
  stub.restore()
})
