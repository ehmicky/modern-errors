import test from 'ava'
import { each } from 'test-each'

import {
  defineClassesOpts,
  defineGlobalOpts,
  defineClassOpts,
} from '../helpers/main.js'

test('Validate invalid class options', (t) => {
  t.throws(defineClassOpts.bind(undefined, true))
})

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`Can pass global and class options | ${title}`, (t) => {
    const { InputError } = defineOpts({ prop: true })
    t.true(new InputError('test').set.options.prop)
  })

  test(`Global and class options are readonly | ${title}`, (t) => {
    const classOpts = { prop: true }
    const { InputError } = defineOpts(classOpts)
    // eslint-disable-next-line fp/no-mutation
    classOpts.prop = false
    t.true(new InputError('test').set.options.prop)
  })
})

test('Class options have priority over global options', (t) => {
  const { InputError } = defineClassesOpts(
    { InputError: { prop: true } },
    { prop: false },
  )
  t.true(new InputError('test').set.options.prop)
})

test('undefined class options are ignored over global ones', (t) => {
  const { InputError } = defineClassesOpts(
    { InputError: { prop: undefined } },
    { prop: true },
  )
  t.true(new InputError('test').set.options.prop)
})

test('undefined global options are ignored over class ones', (t) => {
  const { InputError } = defineClassesOpts(
    { InputError: { prop: true } },
    { prop: undefined },
  )
  t.true(new InputError('test').set.options.prop)
})

test('Object class options are shallowly merged to global options', (t) => {
  const { InputError } = defineClassesOpts(
    { InputError: { prop: { one: true, two: { three: true }, four: true } } },
    { prop: { one: false, two: { three: false }, five: false } },
  )
  t.deepEqual(new InputError('test').set.options.prop, {
    one: true,
    two: { three: true },
    four: true,
    five: false,
  })
})
