import test from 'ava'
import { each } from 'test-each'

import { ErrorSubclasses } from '../helpers/plugin.js'

const { hasOwnProperty: hasOwn } = Object.prototype

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.instanceMethods are set on known errors | ${title}`, (t) => {
    t.is(typeof new ErrorClass('message').getInstance, 'function')
  })

  test(`plugin.instanceMethods are inherited | ${title}`, (t) => {
    t.false(hasOwn.call(new ErrorClass('message'), 'getInstance'))
  })

  test(`plugin.instanceMethods are not enumerable | ${title}`, (t) => {
    t.false(
      Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'getInstance')
        .enumerable,
    )
  })

  test(`plugin.instanceMethods validate the context | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.notThrows(error.getInstance.bind(error))
    t.throws(error.getInstance)
  })

  test(`plugin.instanceMethods are passed the error | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.is(error.getInstance().error, error)
  })
})
