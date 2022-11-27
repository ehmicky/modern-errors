import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../helpers/main.js'
import {
  getUnknownErrors,
  getUnknownErrorInstances,
} from '../helpers/unknown.js'

const assertInstanceOf = function (t, error, ErrorClass) {
  t.true(error instanceof ErrorClass)
  t.is(Object.getPrototypeOf(error), ErrorClass.prototype)
  t.is(error.name, ErrorClass.name)
}

each(ErrorClasses, getUnknownErrors(), ({ title }, ErrorClass, getError) => {
  test(`Unknown cause uses parent class and instance | ${title}`, (t) => {
    const cause = getError()
    const error = new ErrorClass('message', { cause })
    assertInstanceOf(t, error, ErrorClass)
    t.not(error, cause)
  })
})

each(
  ErrorClasses,
  getUnknownErrorInstances(),
  ({ title }, ErrorClass, getError) => {
    test(`Unknown causes are merged | ${title}`, (t) => {
      const error = getError()
      error.one = true
      t.true(new ErrorClass('message', { cause: error }).one)
    })
  },
)

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`ErrorClass with cause of subclass use child class and instance | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const cause = new TestError('causeMessage')
    const error = new ErrorClass('message', { cause })
    assertInstanceOf(t, error, TestError)
    t.is(error, cause)
  })

  test(`ErrorClass with cause of same class use child class and instance | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    const error = new ErrorClass('message', { cause })
    assertInstanceOf(t, error, ErrorClass)
    t.is(error, cause)
  })

  test(`ErrorClass with cause of superclass use parent class and instance | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const cause = new ErrorClass('causeMessage')
    const error = new TestError('message', { cause })
    assertInstanceOf(t, error, TestError)
    t.not(error, cause)
  })

  test(`"cause" property is not left | ${title}`, (t) => {
    t.false('cause' in new ErrorClass('message', { cause: '' }))
  })

  test(`"cause" message is merged | ${title}`, (t) => {
    const outerMessage = 'message'
    const innerMessage = 'causeMessage'
    const error = new ErrorClass(outerMessage, { cause: innerMessage })
    t.false('cause' in error)
    t.is(error.message, `${innerMessage}\n${outerMessage}`)
  })

  test(`"cause" properties are merged | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage', { props: { one: true } })
    const error = new ErrorClass('message', { cause, props: { two: true } })
    t.true(error.one)
    t.true(error.two)
  })

  test(`"cause" is ignored if undefined | ${title}`, (t) => {
    const outerMessage = 'message'
    t.is(
      new ErrorClass(outerMessage, { cause: undefined }).message,
      outerMessage,
    )
  })
})
