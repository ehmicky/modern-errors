import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

import {
  defineSimpleClass,
  defineClassOpts,
  defineGlobalOpts,
  TEST_PLUGIN,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()

test('Does not set options if not defined', (t) => {
  t.is(new TestError('test').set.options.prop, undefined)
})

test('Sets options if defined', (t) => {
  t.true(new TestError('test', { prop: true }).set.options.prop)
})

test('Known errors unsets child options', (t) => {
  const cause = new TestError('causeMessage', { prop: false })
  t.is(new TestError('test', { cause }).set.options.prop, undefined)
})

test('AnyError options do not unset child instance options', (t) => {
  const cause = new TestError('causeMessage', { prop: false })
  t.false(new AnyError('test', { cause }).set.options.prop)
})

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`AnyError options do not unset child global or class options | ${title}`, (t) => {
    const { InputError, AnyError: TestAnyError } = defineOpts({ prop: false })
    const cause = new InputError('causeMessage')
    t.false(new TestAnyError('test', { cause }).set.options.prop)
  })
})

each(
  [TestError, AnyError],
  [{ prop: false }, {}, undefined],
  ({ title }, ErrorClass, opts) => {
    test(`Parent errors options has priority over child | ${title}`, (t) => {
      const cause = new TestError('causeMessage', opts)
      t.true(new ErrorClass('test', { cause, prop: true }).set.options.prop)
    })
  },
)
test('KnownError does not merge options', (t) => {
  const cause = new TestError('causeMessage', { prop: { one: false } })
  t.deepEqual(
    new TestError('test', { cause, prop: { two: true } }).set.options.prop,
    { two: true },
  )
})

test('AnyError merges options shallowly', (t) => {
  const cause = new TestError('causeMessage', {
    prop: { one: false, two: false, four: { five: false } },
  })
  t.deepEqual(
    new AnyError('test', {
      cause,
      prop: { two: true, three: true, four: { six: true } },
    }).set.options.prop,
    { one: false, two: true, three: true, four: { six: true } },
  )
})

test('AnyError merges options on an implicit UnknownError', (t) => {
  const { AnyError: TestAnyError } = modernErrors(
    { UnknownError: { prop: true } },
    [TEST_PLUGIN],
  )
  t.true(new TestAnyError('test', { cause: 0 }).set.options.prop)
})
