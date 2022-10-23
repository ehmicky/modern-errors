import test from 'ava'

import { defineGlobalOpts } from '../helpers/main.js'

test('Cannot pass global "custom"', (t) => {
  t.throws(defineGlobalOpts.bind(undefined, { custom: true }))
})

test('plugin.getOptions() full is false for global options', (t) => {
  t.throws(defineGlobalOpts.bind(undefined, { prop: 'partial' }))
})
