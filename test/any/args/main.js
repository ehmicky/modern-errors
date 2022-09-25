import test from 'ava'
import { each } from 'test-each'

import { defineGlobalOpts, defineClassOpts } from '../../helpers/main.js'

const { TestError } = defineClassOpts()

const message = 'test'

test('error.constructorArgs is set with the error message', (t) => {
  t.deepEqual(new TestError(message).constructorArgs, [message, {}])
})

test('error.constructorArgs with no arguments', (t) => {
  t.deepEqual(new TestError().constructorArgs, ['', {}])
})

test('error.constructorArgs with an invalid error message', (t) => {
  t.deepEqual(new TestError(true).constructorArgs, ['true', {}])
})

test('error.constructorArgs is not enumerable', (t) => {
  t.false(
    Object.getOwnPropertyDescriptor(new TestError(message), 'constructorArgs')
      .enumerable,
  )
})

test('error.constructorArgs includes additional arguments', (t) => {
  t.deepEqual(new TestError(message, {}, true, false).constructorArgs, [
    message,
    {},
    true,
    false,
  ])
})

test('error.constructorArgs additional arguments cannot be mutated', (t) => {
  const state = {}
  const { constructorArgs } = new TestError(message, {}, state)
  state.prop = true
  t.deepEqual(constructorArgs, [message, {}, {}])
})

each(['cause', 'errors'], ({ title }, propName) => {
  test(`error.constructorArgs omits cause and errors | ${title}`, (t) => {
    t.deepEqual(
      new TestError(message, { [propName]: true }).constructorArgs[1],
      {},
    )
  })
})

each(['other', 'prop'], ({ title }, propName) => {
  test(`error.constructorArgs keeps plugin and non-plugin options | ${title}`, (t) => {
    t.deepEqual(new TestError(message, { [propName]: true }).constructorArgs, [
      message,
      { [propName]: true },
    ])
  })
})

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`error.constructorArgs does not contain global nor class options | ${title}`, (t) => {
    const { TestError: OtherTestError } = defineOpts({ prop: true })
    t.deepEqual(new OtherTestError(message).constructorArgs, [message, {}])
  })
})
