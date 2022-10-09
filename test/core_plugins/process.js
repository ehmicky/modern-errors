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

const { TestError, UnknownError, AnyError } = defineClassOpts({}, {}, [
  PROCESS_PLUGIN,
])
const ChildUnknownError = UnknownError.subclass('ChildUnknownError')

each(
  [true, { unknown: true }, { exit: 'true' }, { onError: true }],
  ({ title }, options) => {
    test.serial(`Options are validated | ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      t.throws(() => AnyError.logProcess(options))
    })
  },
)

const createProcessError = async function (error) {
  emitWarning(error)
  await pSetInterval()
}

test.serial('Prints on the console by default', async (t) => {
  // eslint-disable-next-line no-restricted-globals
  const consoleError = sinon.stub(console, 'error')
  const stopLogging = AnyError.logProcess()
  const error = new UnknownError('test')
  await createProcessError(error)
  t.is(consoleError.args[0][0], error)
  stopLogging()
  consoleError.restore()
})

test.serial('Handles process errors', async (t) => {
  const onError = sinon.spy()
  const stopLogging = AnyError.logProcess({ onError })
  const error = new UnknownError('test')
  await createProcessError(error)
  t.deepEqual(onError.args, [[error, 'warning']])
  stopLogging()
})

each(
  [
    { error: 'test', message: 'Warning: test' },
    { error: new Error('test'), message: 'test' },
    { error: new TypeError('test'), message: 'test' },
    {
      // eslint-disable-next-line fp/no-mutating-assign
      error: Object.assign(new Error('test'), { name: 'NamedError' }),
      message: 'NamedError: test',
    },
    { error: new UnknownError('test'), message: 'test' },
    { error: new ChildUnknownError('test'), message: 'test' },
    { error: new TestError('test'), message: 'TestError: test' },
  ],
  ({ title }, { error, message }) => {
    test.serial(
      `Process errors are normalized to UnknownError | ${title}`,
      async (t) => {
        const onError = sinon.spy()
        const stopLogging = AnyError.logProcess({ onError })
        await createProcessError(error)
        t.true(onError.args[0][0] instanceof UnknownError)
        t.is(onError.args[0][0].message, message)
        stopLogging()
      },
    )
  },
)
