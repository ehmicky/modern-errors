import test from 'ava'
import { each } from 'test-each'

import {
  defineGlobalOpts,
  defineClassOpts,
  defineClassesOpts,
  defineDeepCustom,
} from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

test('Cannot pass global "custom"', (t) => {
  t.throws(defineGlobalOpts.bind(undefined, { custom: true }))
})

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

test('plugin.getOptions() full is false for global options', (t) => {
  t.throws(defineGlobalOpts.bind(undefined, { prop: 'partial' }))
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

each([defineClassOpts, defineDeepCustom], ({ title }, defineOpts) => {
  test(`Child options have priority over parent ones | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: true }, { prop: false })
    t.true(new TestError('test').properties.options.prop)
  })

  test(`undefined child options are ignored over parent ones | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: undefined }, { prop: true })
    t.true(new TestError('test').properties.options.prop)
  })

  test(`undefined parent options are ignored over child ones | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: true }, { prop: undefined })
    t.true(new TestError('test').properties.options.prop)
  })

  test(`Object child options are shallowly merged to parent options | ${title}`, (t) => {
    const { TestError } = defineOpts(
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
})
