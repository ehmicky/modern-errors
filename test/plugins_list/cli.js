import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import CLI_PLUGIN from '../../src/core_plugins/cli.js'
import { errorExit } from '../helpers/cli/main.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts({}, {}, [CLI_PLUGIN])

const message = 'test'
const testError = new TestError(message, { cli: { timeout: 0 } })

each(
  [true, { timeout: 'true' }, { unknown: true }, { classes: {} }],
  ({ title }, cli) => {
    test(`Options are validated | ${title}`, (t) => {
      t.throws(testError.exit.bind(undefined, cli))
    })
  },
)

test.serial('Call process.exit()', (t) => {
  const { consoleArg, exitCode } = errorExit(testError)
  t.true(Number.isInteger(exitCode))
  t.is(consoleArg, message)
})
