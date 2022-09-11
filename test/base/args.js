import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass } from '../helpers/main.js'

const { TestError } = defineSimpleClass()

test('Allows empty options', (t) => {
  t.notThrows(() => new TestError('test'))
})

// eslint-disable-next-line unicorn/no-null
each([null, '', { custom: class extends Error {} }], ({ title }, opts) => {
  test(`Validate against invalid options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', opts))
  })
})
