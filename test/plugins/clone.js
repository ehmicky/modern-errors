import test from 'ava'

import { defineClassOpts } from '../helpers/main.js'

const { TestError } = defineClassOpts()

test('Options can be symbols', (t) => {
  const symbol = Symbol('test')
  t.true(
    new TestError('test', { prop: { [symbol]: true } }).set.options.prop[
      symbol
    ],
  )
})

test('Options can be non-enumerable', (t) => {
  const { options } = new TestError('test', {
    // eslint-disable-next-line fp/no-mutating-methods
    prop: Object.defineProperty({}, 'one', {
      value: true,
      enumerable: false,
      writable: true,
      configurable: true,
    }),
  }).set
  t.true(options.prop.one)
  t.false(Object.getOwnPropertyDescriptor(options.prop, 'one').enumerable)
})

test('Options can be arrays', (t) => {
  t.true(
    new TestError('test', { prop: [{ one: true }] }).set.options.prop[0].one,
  )
})
