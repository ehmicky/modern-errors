import test from 'ava'
import { each } from 'test-each'

import {
  defineGlobalOpts,
  defineClassOpts,
  defineClassesOpts,
} from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`Validate invalid global and class options | ${title}`, (t) => {
    t.throws(defineOpts.bind(undefined, true))
  })

  test(`Can pass global and class options | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: true })
    t.true(new TestError('test').properties.options.prop)
  })

  test(`Global and class options are readonly | ${title}`, (t) => {
    const classOpts = { prop: { one: true } }
    const { TestError } = defineOpts(classOpts)
    // eslint-disable-next-line fp/no-mutation
    classOpts.prop.one = false
    t.true(new TestError('test').properties.options.prop.one)
  })

  test(`Cannot pass unknown options | ${title}`, (t) => {
    t.throws(defineOpts.bind(undefined, { one: true }))
  })
})

test('plugin.getOptions() full is false for class options', (t) => {
  t.throws(defineClassOpts.bind(undefined, { prop: 'partial' }))
})

test('plugin.getOptions() full is false for UnknownError options with plugin.properties undefined', (t) => {
  t.throws(
    defineClassesOpts.bind(
      undefined,
      { UnknownError: { prop: 'partial' } },
      {},
      [{ ...TEST_PLUGIN, properties: undefined }],
    ),
  )
})

test('plugin.getOptions() full is true for UnknownError options with plugin.properties defined', (t) => {
  t.notThrows(
    defineClassesOpts.bind(undefined, { UnknownError: { prop: 'partial' } }),
  )
})

test('Child options have priority over parent ones', (t) => {
  const { TestError } = defineClassOpts({ prop: true }, { prop: false })
  t.true(new TestError('test').properties.options.prop)
})

test('undefined child options are ignored over parent ones', (t) => {
  const { TestError } = defineClassOpts({ prop: undefined }, { prop: true })
  t.true(new TestError('test').properties.options.prop)
})

test('undefined parent options are ignored over child ones', (t) => {
  const { TestError } = defineClassOpts({ prop: true }, { prop: undefined })
  t.true(new TestError('test').properties.options.prop)
})

test('Object child options are shallowly merged to parent options', (t) => {
  const { TestError } = defineClassOpts(
    { prop: { one: true, two: { three: true }, four: true } },
    { prop: { one: false, two: { three: false }, five: false } },
  )
  t.deepEqual(new TestError('test').properties.options.prop, {
    one: true,
    two: { three: true },
    four: true,
    five: false,
  })
})
