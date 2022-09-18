import test from 'ava'
import { each } from 'test-each'

import {
  createAnyError,
  defineGlobalOpts,
  defineClassOpts,
  defineDeepCustom,
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

each([defineClassOpts, defineDeepCustom], ({ title }, defineOpts) => {
  test(`Child options have priority over parent ones | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: true }, { prop: false })
    t.true(new TestError('test').set.options.prop)
  })

  test(`undefined child options are ignored over parent ones | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: undefined }, { prop: true })
    t.true(new TestError('test').set.options.prop)
  })

  test(`undefined parent options are ignored over child ones | ${title}`, (t) => {
    const { TestError } = defineOpts({ prop: true }, { prop: undefined })
    t.true(new TestError('test').set.options.prop)
  })

  test(`Object child options are shallowly merged to parent options | ${title}`, (t) => {
    const { TestError } = defineOpts(
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
})

test('Cannot use "custom" with UnknownError', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() =>
    TestAnyError.subclass('UnknownError', {
      custom: class extends TestAnyError {},
    }),
  )
})
