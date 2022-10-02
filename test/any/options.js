import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, createAnyError } from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

test('Allows empty options', (t) => {
  t.notThrows(() => new TestError('test'))
})

each([null, '', { custom: true }], ({ title }, opts) => {
  test(`Validate against invalid options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new TestError('test', opts))
  })
})

test('Requires AnyError.subclass()', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() => new TestAnyError('test', { cause: '' }))
})

test('Validate that AnyError has 2 arguments', (t) => {
  const cause = new TestError('causeMessage')
  t.throws(() => new AnyError('message', { cause }, true))
})
