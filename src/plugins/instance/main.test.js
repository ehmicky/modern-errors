import test from 'ava'
import { each } from 'test-each'

import { ErrorSubclasses } from '../../helpers/plugin.test.js'

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.instanceMethods are set on known errors | ${title}`, (t) => {
    t.is(typeof new ErrorClass('message').getInstance, 'function')
  })

  test(`Mixed plugin.instanceMethods are set on ErrorClass | ${title}`, (t) => {
    t.is(typeof ErrorClass.getInstance, 'function')
  })

  test(`plugin.instanceMethods are inherited | ${title}`, (t) => {
    t.false(Object.hasOwn(new ErrorClass('message'), 'getInstance'))
  })

  test(`plugin.instanceMethods are not enumerable | ${title}`, (t) => {
    t.false(
      Object.getOwnPropertyDescriptor(ErrorClass.prototype, 'getInstance')
        .enumerable,
    )
  })

  test(`Mixed plugin.instanceMethods are not enumerable | ${title}`, (t) => {
    t.deepEqual(Object.keys(ErrorClass), [])
  })

  test(`plugin.instanceMethods validate the context | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.notThrows(error.getInstance.bind(error))
    t.throws(error.getInstance)
  })

  test(`Mixed plugin.instanceMethods context is bound | ${title}`, (t) => {
    const { getInstance } = ErrorClass
    const error = new ErrorClass('message')
    t.deepEqual(getInstance(error, 0).args, [0])
  })

  test(`plugin.instanceMethods are passed the error | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.is(error.getInstance().error, error)
  })

  test(`Mixed plugin.instanceMethods are passed the error | ${title}`, (t) => {
    const error = new ErrorClass('message')
    t.deepEqual(ErrorClass.getInstance(error, 0).error, error)
  })

  test(`Mixed plugin.instanceMethods are passed the normalized error | ${title}`, (t) => {
    const { error } = ErrorClass.getInstance()
    t.true(error instanceof ErrorClass)
    t.is(error.message, '')
  })
})
