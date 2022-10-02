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

// The first lines sometimes contain a preview
const isCleanStack = function (stack) {
  return stack.split('\n').slice(1).join('\n').includes(cwd)
}

test('stack is cleaned', (t) => {
  t.true(isCleanStack(testError.stack))
  t.false(isCleanStack(stackError.stack))
})

test('stack remains non-enumerable', (t) => {
  t.false(Object.getOwnPropertyDescriptor(stackError, 'stack').enumerable)
})
