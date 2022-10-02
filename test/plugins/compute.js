import test from 'ava'
import { each } from 'test-each'

import {
  defineClassOpts,
  defineGlobalOpts,
  defineClassesOpts,
} from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

test('Does not set options if not defined', (t) => {
  t.is(new TestError('test').properties.options.prop, undefined)
})

test('Sets options if defined', (t) => {
  t.true(new TestError('test', { prop: true }).properties.options.prop)
})

test('Known errors unsets child options', (t) => {
  const cause = new TestError('causeMessage', { prop: false })
  t.is(new TestError('test', { cause }).properties.options.prop, undefined)
})

test('AnyError options do not unset child instance options', (t) => {
  const cause = new TestError('causeMessage', { prop: false })
  t.false(new AnyError('test', { cause }).properties.options.prop)
})

each([defineClassOpts, defineGlobalOpts], ({ title }, defineOpts) => {
  test(`AnyError options do not unset child global or class options | ${title}`, (t) => {
    const { TestError: OtherTestError, AnyError: TestAnyError } = defineOpts({
      prop: false,
    })
    const cause = new OtherTestError('causeMessage')
    t.false(new TestAnyError('test', { cause }).properties.options.prop)
  })
})

each(
  [TestError, AnyError],
  [{ prop: false }, {}, undefined],
  ({ title }, ErrorClass, opts) => {
    test(`Parent errors options has priority over child | ${title}`, (t) => {
      const cause = new TestError('causeMessage', opts)
      t.true(
        new ErrorClass('test', { cause, prop: true }).properties.options.prop,
      )
    })
  },
)
test('KnownError does not merge options', (t) => {
  const cause = new TestError('causeMessage', { prop: { one: false } })
  t.deepEqual(
    new TestError('test', { cause, prop: { two: true } }).properties.options
      .prop,
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
    }).properties.options.prop,
    { one: false, two: true, three: true, four: { six: true } },
  )
})

test('AnyError merges options on an implicit UnknownError', (t) => {
  const { AnyError: TestAnyError } = defineClassesOpts({
    UnknownError: { prop: true },
  })
  t.true(new TestAnyError('test', { cause: 0 }).properties.options.prop)
})

test('plugin.properties() cannot modify "options" passed to instance methods', (t) => {
  const error = new TestError('test', { prop: { one: true } })
  error.properties.options.prop.one = false
  t.true(error.getInstance().options.prop.one)
})
