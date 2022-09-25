import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

const message = 'test'

const opts = { prop: true }
const innerDeepOpts = { prop: { one: false, two: false } }
const outerDeepOpts = { prop: { one: true, three: true } }
each(
  [
    { ErrorClass: TestError, innerOpts: {}, outerOpts: {}, finalOpts: {} },
    { ErrorClass: AnyError, innerOpts: {}, outerOpts: {}, finalOpts: {} },
    { ErrorClass: TestError, innerOpts: {}, outerOpts: opts, finalOpts: opts },
    { ErrorClass: AnyError, innerOpts: {}, outerOpts: opts, finalOpts: opts },
    { ErrorClass: TestError, innerOpts: opts, outerOpts: {}, finalOpts: {} },
    { ErrorClass: AnyError, innerOpts: opts, outerOpts: {}, finalOpts: opts },
    {
      ErrorClass: TestError,
      innerOpts: innerDeepOpts,
      outerOpts: outerDeepOpts,
      finalOpts: { prop: { one: true, three: true } },
    },
    {
      ErrorClass: AnyError,
      innerOpts: innerDeepOpts,
      outerOpts: outerDeepOpts,
      finalOpts: { prop: { one: true, two: false, three: true } },
    },
  ],
  ({ title }, { ErrorClass, innerOpts, outerOpts, finalOpts }) => {
    test(`error.constructorArgs uses merged options | ${title}`, (t) => {
      const cause = new TestError('', innerOpts)
      t.deepEqual(
        new ErrorClass(message, { cause, ...outerOpts }).constructorArgs,
        [message, finalOpts],
      )
    })
  },
)

each(
  [
    { ErrorClass: AnyError, finalOpts: { one: true, two: false, three: true } },
    { ErrorClass: TestError, finalOpts: { one: true, three: true } },
  ],
  ({ title }, { ErrorClass, finalOpts }) => {
    test(`error.constructorArgs merges inner non plugin options if AnyError | ${title}`, (t) => {
      const cause = new TestError(message, { one: false, two: false })
      t.deepEqual(
        new ErrorClass('', { cause, one: true, three: true }).constructorArgs,
        [message, finalOpts],
      )
    })
  },
)

each(
  [
    { ErrorClass: AnyError, outerArgs: [], finalArgs: [true] },
    { ErrorClass: TestError, outerArgs: [false], finalArgs: [false] },
  ],
  ({ title }, { ErrorClass, outerArgs, finalArgs }) => {
    test(`error.constructorArgs merges inner arguments if AnyError | ${title}`, (t) => {
      const cause = new TestError(message, {}, true)
      t.deepEqual(new ErrorClass('', { cause }, ...outerArgs).constructorArgs, [
        message,
        {},
        ...finalArgs,
      ])
    })
  },
)

each([true, ['', true]], ({ title }, constructorArgs) => {
  test(`error.constructorArgs ignores invalid inner constructorArgs | ${title}`, (t) => {
    const error = new TestError(message, { one: true })
    error.constructorArgs = constructorArgs
    t.deepEqual(new AnyError('', { cause: error }).constructorArgs, [
      message,
      {},
    ])
  })
})
