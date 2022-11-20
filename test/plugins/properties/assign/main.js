import test from 'ava'
import { each } from 'test-each'

import { ErrorSubclasses } from '../../../helpers/plugin.js'

each(ErrorSubclasses, ['one', Symbol('one')], ({ title }, ErrorClass, key) => {
  test(`plugin.properties() can set properties | ${title}`, (t) => {
    t.true(new ErrorClass('test', { prop: { toSet: { [key]: true } } })[key])
  })

  test(`plugin.properties() changes are not reverted by parent error | ${title}`, (t) => {
    const cause = new ErrorClass('test', { prop: { toSet: { [key]: true } } })
    t.true(new ErrorClass('test', { cause })[key])
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
  test(`plugin.properties() can return an empty object | ${title}`, (t) => {
    t.notThrows(() => new ErrorClass('test', { prop: { toSet: {} } }))
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

  test(`Object instance options are shallowly merged to class options | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError', {
      prop: { one: false, five: false, two: { three: false } },
    })
    const error = new TestError('test', {
      prop: { one: true, two: { three: true }, four: true },
    })
    t.deepEqual(error.properties.options.prop, {
      one: true,
      two: { three: true },
      five: false,
      four: true,
    })
  })

  test(`plugin.properties() can set non-enumerable properties | ${title}`, (t) => {
    const error = new ErrorClass('test', { prop: { toSet: { _prop: true } } })
    // eslint-disable-next-line no-underscore-dangle
    t.true(error._prop)
    t.false(Object.getOwnPropertyDescriptor(error, '_prop').enumerable)
  })

  test(`plugin.properties() keeps descriptors | ${title}`, (t) => {
    const cause = new ErrorClass('test')
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(cause, 'prop', {
      value: false,
      enumerable: false,
      writable: true,
      configurable: true,
    })
    const error = new ErrorClass('', { cause, prop: { toSet: { prop: true } } })
    t.true(error.prop)
    t.false(Object.getOwnPropertyDescriptor(error, 'prop').enumerable)
  })
})
