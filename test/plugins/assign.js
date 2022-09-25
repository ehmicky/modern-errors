import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { TestError, AnyError } = defineClassOpts()

each([undefined, true], ({ title }, value) => {
  test(`plugin.set() must return a plain object | ${title}`, (t) => {
    const { TestError: OtherTestError } = defineClassOpts({}, {}, [
      { ...TEST_PLUGIN, set: () => value },
    ])
    t.throws(() => new OtherTestError('test'))
  })
})

test('plugin.set() can modify error.message', (t) => {
  t.is(
    new TestError('test', { prop: { toSet: { message: '0' } } }).set.error
      .message,
    '0',
  )
})

each(['one', Symbol('one')], ({ title }, key) => {
  test(`plugin.set() can set properties | ${title}`, (t) => {
    t.true(
      new TestError('test', { prop: { toSet: { [key]: true } } }).set.error[
        key
      ],
    )
  })
})

each(
  ['wrap', 'constructorArgs', 'name', 'stack', 'cause', 'errors'],
  ({ title }, key) => {
    test(`plugin.set() cannot set forbidden properties | ${title}`, (t) => {
      t.not(
        new TestError('test', { prop: { toSet: { [key]: 'true' } } }).set.error[
          key
        ],
        'true',
      )
    })
  },
)

test('plugin.set() shallow merge properties', (t) => {
  const cause = new TestError('test', {
    prop: { toSet: { one: false, two: false } },
  })
  const error = new AnyError('', {
    cause,
    prop: { toSet: { one: true, three: true } },
  })
  t.true(error.one)
  t.false(error.two)
  t.true(error.three)
})
