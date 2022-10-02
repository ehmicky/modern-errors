import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import CLI_PLUGIN from '../../src/core_plugins/cli.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts({}, {}, [CLI_PLUGIN])

const testError = new TestError('test')

each([true, { timeout: 'true' }, { unknown: true }], ({ title }, cli) => {
  test(`Options are validated | ${title}`, (t) => {
    t.throws(testError.exit.bind(undefined, cli))
  })
})
