import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import CLI_PLUGIN from '../../src/core_plugins/cli.js'
import { errorExit } from '../helpers/cli/main.js'
import { defineClassOpts, defineClassesOpts } from '../helpers/main.js'

const testGlobalOpts = { cli: { timeout: 0 } }
const { TestError, AnyError } = defineClassOpts({}, testGlobalOpts, [
  CLI_PLUGIN,
])

const message = 'test'
const testError = new TestError(message)

each(
  [true, { timeout: 'true' }, { unknown: true }, { classes: {} }],
  ({ title }, cli) => {
    test(`Options are validated | ${title}`, (t) => {
      t.throws(testError.exit.bind(undefined, cli))
    })
  },
)

test.serial('Call process.exit()', (t) => {
  t.true(Number.isInteger(errorExit(testError).exitCode))
})

test.serial('Can pass "exitCode"', (t) => {
  const exitCode = 5
  t.is(errorExit(testError, { exitCode }).exitCode, exitCode)
})

test.serial('"exitCode" defaults to incrementing number', (t) => {
  const exitCode = 5
  const { UnknownError, OneError, TwoError, ThreeError } = defineClassesOpts(
    {
      OneError: {},
      TwoError: { cli: { exitCode } },
      ThreeError: {},
    },
    testGlobalOpts,
    [CLI_PLUGIN],
  )
  t.is(errorExit(new UnknownError('')).exitCode, 1)
  t.is(errorExit(new OneError('')).exitCode, 2)
  t.is(errorExit(new TwoError('')).exitCode, exitCode)
  // eslint-disable-next-line no-magic-numbers
  t.is(errorExit(new ThreeError('')).exitCode, 4)
})

test.serial('Can pass "silent"', (t) => {
  t.is(errorExit(testError, { silent: true }).consoleArg, undefined)
})

test.serial('Can pass "short"', (t) => {
  t.is(errorExit(testError, { short: false }).consoleArg, testError)
})

test.serial('"short" defaults to true', (t) => {
  t.is(errorExit(testError).consoleArg, message)
})

test.serial('"short" is false with unknown errors', (t) => {
  t.true(errorExit(new AnyError('', { cause: '' })).consoleArg instanceof Error)
})
