import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { TestError, AnyError } = defineClassOpts()

const setUnsetProps = [
  { propName: 'toSet', name: 'set', getError: (error) => error },
  {
    propName: 'toUnset',
    name: 'unset',
    getError: (cause, OtherAnyError) => new OtherAnyError('', { cause }),
  },
]

each(
  setUnsetProps,
  [undefined, true],
  ({ title }, { name, getError }, value) => {
    test(`plugin.set() and unset() must return a plain object | ${title}`, (t) => {
      const { TestError: OtherTestError, AnyError: OtherAnyError } =
        defineClassOpts({}, {}, [{ ...TEST_PLUGIN, [name]: () => value }])
      t.throws(() => getError(new OtherTestError('test'), OtherAnyError))
    })
  },
)

each(setUnsetProps, ({ title }, { propName, name, getError }) => {
  test(`plugin.set() and unset() can modify error.message | ${title}`, (t) => {
    const error = new TestError('test', {
      prop: { [propName]: { message: '0' } },
    })
    t.is(getError(error, AnyError)[name].error.message, '0')
  })
})

each(
  setUnsetProps,
  ['one', Symbol('one')],
  ({ title }, { propName, name, getError }, key) => {
    test(`plugin.set() and unset() can set properties | ${title}`, (t) => {
      const error = new TestError('test', {
        prop: { [propName]: { [key]: true } },
      })
      t.true(getError(error, AnyError)[name].error[key])
    })
  },
)

each(
  setUnsetProps,
  ['wrap', 'constructorArgs', 'name', 'stack', 'cause', 'errors'],
  ({ title }, { propName, name, getError }, key) => {
    test(`plugin.set() and unset() cannot set forbidden properties | ${title}`, (t) => {
      const error = new TestError('test', {
        prop: { [propName]: { [key]: 'true' } },
      })
      t.not(getError(error, AnyError)[name].error[key], 'true')
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

test('plugin.unset() shallow merge properties', (t) => {
  const cause = new TestError('test', {
    prop: { toUnset: { one: true, three: true } },
  })
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(cause, { one: false, two: false })
  const error = new AnyError('', { cause })
  t.true(error.one)
  t.false(error.two)
  t.true(error.three)
})
