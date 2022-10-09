import test from 'ava'
import { each } from 'test-each'

// eslint-disable-next-line no-restricted-imports
import PROCESS_PLUGIN from '../../src/core_plugins/process.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts({}, {}, [PROCESS_PLUGIN])

each([true, 'test', '//'], ({ title }, bugs) => {
  test.skip(`bugs is validated | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', { bugs }))
  })
})
