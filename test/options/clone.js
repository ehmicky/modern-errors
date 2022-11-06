import test from 'ava'
import { each } from 'test-each'

import { ErrorSubclasses } from '../helpers/plugin.js'

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`Options can be symbols | ${title}`, (t) => {
    const symbol = Symbol('test')
    t.true(
      new ErrorClass('test', { prop: { [symbol]: true } }).properties.options
        .prop[symbol],
    )
  })

  test(`Options can be non-enumerable | ${title}`, (t) => {
    const { options } = new ErrorClass('test', {
      // eslint-disable-next-line fp/no-mutating-methods
      prop: Object.defineProperty({}, 'one', {
        value: true,
        enumerable: false,
        writable: true,
        configurable: true,
      }),
    }).properties
    t.true(options.prop.one)
    t.false(Object.getOwnPropertyDescriptor(options.prop, 'one').enumerable)
  })

  test(`Options can be arrays | ${title}`, (t) => {
    t.true(
      new ErrorClass('test', { prop: [{ one: true }] }).properties.options
        .prop[0].one,
    )
  })
})
