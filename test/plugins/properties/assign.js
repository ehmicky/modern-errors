import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

const { TestError, AnyError } = defineClassOpts()

each([undefined, true], ({ title }, value) => {
  test(`plugin.properties() must return a plain object | ${title}`, (t) => {
    const { TestError: OtherTestError } = defineClassOpts({}, {}, [
      { ...TEST_PLUGIN, properties: () => value },
    ])
    t.throws(() => new OtherTestError('test'))
  })
})

each(['message', 'stack'], ({ title }, key) => {
  test(`plugin.properties() can set some core properties | ${title}`, (t) => {
    const error = new TestError('test', { prop: { toSet: { [key]: '0' } } })
    t.is(error[key], '0')
    t.false(Object.getOwnPropertyDescriptor(error, key).enumerable)
  })
})

test('plugin.properties() can set both message and stack', (t) => {
  const oldMessage = 'one'
  const message = 'two'
  const stackPrefix = 'Stack: '
  const error = new TestError(oldMessage, {
    prop: { toSet: { message, stack: `${stackPrefix}${oldMessage}` } },
  })
  t.is(error.message, message)
  t.is(error.stack, `${stackPrefix}${message}`)
})

each(['one', Symbol('one')], ({ title }, key) => {
  test(`plugin.properties() can set properties | ${title}`, (t) => {
    t.true(new TestError('test', { prop: { toSet: { [key]: true } } })[key])
  })
})

each(
  ['wrap', 'constructorArgs', 'name', 'cause', 'errors', 'getInstance'],
  ({ title }, key) => {
    test(`plugin.properties() cannot set forbidden properties | ${title}`, (t) => {
      t.not(
        new TestError('test', { prop: { toSet: { [key]: 'true' } } })[key],
        'true',
      )
    })
  },
)

test('plugin.properties() shallow merge properties', (t) => {
  const error = new Error('test')
  error.one = false
  error.two = false
  const { one, two, three } = new TestError('test', {
    cause: error,
    prop: { toSet: { one: true, three: true } },
  })
  t.true(one)
  t.false(two)
  t.true(three)
})

test('plugin.properties() non-enumerable properties can be assigned', (t) => {
  const cause = new TestError('test')
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(cause, 'nonEnumProp', {
    value: true,
    enumerable: false,
    writable: true,
    configurable: true,
  })

  const error = new AnyError('test', {
    cause,
    prop: { toSet: { nonEnumProp: false } },
  })
  t.false(error.nonEnumProp)
  t.false(Object.getOwnPropertyDescriptor(error, 'nonEnumProp').enumerable)
})
