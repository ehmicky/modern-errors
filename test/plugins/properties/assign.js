import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'
import { TEST_PLUGIN } from '../../helpers/plugin.js'

const { ErrorSubclasses } = getClasses({ plugins: [TEST_PLUGIN] })
const { ErrorClasses } = getClasses()

each(ErrorClasses, [undefined, true], ({ title }, ErrorClass, value) => {
  test(`plugin.properties() must return a plain object | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      plugins: [{ ...TEST_PLUGIN, properties: () => value }],
    })
    t.throws(() => new TestError('test'))
  })
})

each(ErrorSubclasses, ['one', Symbol('one')], ({ title }, ErrorClass, key) => {
  test(`plugin.properties() can set properties | ${title}`, (t) => {
    t.true(new ErrorClass('test', { prop: { toSet: { [key]: true } } })[key])
  })

  test(`plugin.properties() changes are not reverted by parent error | ${title}`, (t) => {
    const cause = new ErrorClass('test', { prop: { toSet: { [key]: true } } })
    t.true(new ErrorClass('test', { cause })[key])
  })
})

each(ErrorSubclasses, ['message', 'stack'], ({ title }, ErrorClass, key) => {
  test(`plugin.properties() can set some core properties | ${title}`, (t) => {
    const error = new ErrorClass('test', { prop: { toSet: { [key]: '0' } } })
    t.is(error[key], '0')
    t.false(Object.getOwnPropertyDescriptor(error, key).enumerable)
  })
})

each(
  ErrorSubclasses,
  ['wrap', 'constructorArgs', 'name', 'cause', 'errors', 'getInstance'],
  ({ title }, ErrorClass, key) => {
    test(`plugin.properties() cannot set forbidden properties | ${title}`, (t) => {
      t.not(
        new ErrorClass('test', { prop: { toSet: { [key]: 'true' } } })[key],
        'true',
      )
    })
  },
)
each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.properties() can set both message and stack | ${title}`, (t) => {
    const oldMessage = 'one'
    const message = 'two'
    const stackPrefix = 'Stack: '
    const error = new ErrorClass(oldMessage, {
      prop: { toSet: { message, stack: `${stackPrefix}${oldMessage}` } },
    })
    t.is(error.message, message)
    t.is(error.stack, `${stackPrefix}${message}`)
  })

  test(`plugin.properties() shallow merge properties | ${title}`, (t) => {
    const error = new Error('test')
    error.one = false
    error.two = false
    const { one, two, three } = new ErrorClass('test', {
      cause: error,
      prop: { toSet: { one: true, three: true } },
    })
    t.true(one)
    t.false(two)
    t.true(three)
  })

  test(`plugin.properties() non-enumerable properties can be assigned | ${title}`, (t) => {
    const cause = new ErrorClass('test')
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(cause, 'nonEnumProp', {
      value: true,
      enumerable: false,
      writable: true,
      configurable: true,
    })

    const error = new ErrorClass('test', {
      cause,
      prop: { toSet: { nonEnumProp: false } },
    })
    t.false(error.nonEnumProp)
    t.false(Object.getOwnPropertyDescriptor(error, 'nonEnumProp').enumerable)
  })
})
