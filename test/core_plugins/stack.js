import { cwd as getCwd } from 'process'

import test from 'ava'

// eslint-disable-next-line no-restricted-imports
import STACK_PLUGIN from '../../src/core_plugins/stack.js'
import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts()
const { TestError: StackError } = defineClassOpts({}, {}, [STACK_PLUGIN])
const testError = new TestError('test')
const stackError = new StackError('test')
const cwd = getCwd()

test('stack is cleaned', (t) => {
  t.true(testError.stack.includes(cwd))
  t.false(stackError.stack.includes(cwd))
})

test('stack remains non-enumerable', (t) => {
  t.false(Object.getOwnPropertyDescriptor(stackError, 'stack').enumerable)
})

test.serial('noop in browsers', (t) => {
  // eslint-disable-next-line n/prefer-global/process
  const oldProcess = globalThis.process
  // eslint-disable-next-line n/prefer-global/process, fp/no-mutation
  globalThis.process = undefined
  const { stack } = new StackError('test')
  // eslint-disable-next-line n/prefer-global/process, fp/no-mutation
  globalThis.process = oldProcess
  t.true(stack.includes(cwd))
})
