import test from 'ava'
import { each } from 'test-each'

import {
  createAnyError,
  defineGlobalOpts,
  defineClassOpts,
} from '../helpers/main.js'

test('Cannot pass global "custom"', (t) => {
  t.throws(defineGlobalOpts.bind(undefined, { custom: true }))
})

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`Validate invalid global and class options | ${title}`, (t) => {
    t.throws(defineOpts.bind(undefined, true))
  })

  test(`Can pass global and class options | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: true })
    t.true(new TestError('test').set.options.prop)
  })

  test(`Global and class options are readonly | ${title}`, (t) => {
    const classOpts = { prop: true }
    const { TestError } = defineOpts(classOpts)
    // eslint-disable-next-line fp/no-mutation
    classOpts.prop = false
    t.true(new TestError('test').set.options.prop)
  })
})

test('Class options have priority over global options', (t) => {
  const { TestError } = defineClassOpts({ prop: true }, { prop: false })
  t.true(new TestError('test').set.options.prop)
})

test('undefined class options are ignored over global ones', (t) => {
  const { TestError } = defineClassOpts({ prop: undefined }, { prop: true })
  t.true(new TestError('test').set.options.prop)
})

test('undefined global options are ignored over class ones', (t) => {
  const { TestError } = defineClassOpts({ prop: true }, { prop: undefined })
  t.true(new TestError('test').set.options.prop)
})

test('Object class options are shallowly merged to global options', (t) => {
  const { TestError } = defineClassOpts(
    { prop: { one: true, two: { three: true }, four: true } },
    { prop: { one: false, two: { three: false }, five: false } },
  )
  t.deepEqual(new TestError('test').set.options.prop, {
    one: true,
    two: { three: true },
    four: true,
    five: false,
  })
})

test('Cannot use "custom" with UnknownError', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() =>
    TestAnyError.subclass('UnknownError', {
      custom: class extends TestAnyError {},
    }),
  )
})
