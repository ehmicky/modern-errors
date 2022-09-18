import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass, createAnyError } from '../helpers/main.js'

const { TestError } = defineSimpleClass()

test('Allows empty options', (t) => {
  t.notThrows(() => new TestError('test'))
})

// eslint-disable-next-line unicorn/no-null
each([null, '', { custom: true }], ({ title }, opts) => {
  test(`Validate against invalid options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', opts))
  })
})

test('Requires Any.create()', (t) => {
  const AnyError = createAnyError()
  t.throws(() => new AnyError('test', { cause: '' }))
})
