import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.js'
import { getUnknownErrors } from '../helpers/unknown.js'

const { ErrorClasses } = getClasses()

const assertInstanceOf = function (t, error, ErrorClass) {
  t.true(error instanceof ErrorClass)
  t.is(Object.getPrototypeOf(error), ErrorClass.prototype)
  t.is(error.name, ErrorClass.name)
}

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`ErrorClass with cause of same class use child class and instance | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    const error = new ErrorClass('message', { cause })
    assertInstanceOf(t, error, ErrorClass)
    t.is(error, cause)
  })

  test(`"cause" is merged | ${title}`, (t) => {
    const outerMessage = 'message'
    const innerMessage = 'causeMessage'
    const error = new ErrorClass(outerMessage, { cause: innerMessage })
    t.false('cause' in error)
    t.is(error.message, `${innerMessage}\n${outerMessage}`)
  })

  test(`"cause" is ignored if undefined | ${title}`, (t) => {
    const outerMessage = 'message'
    const error = new ErrorClass(outerMessage, { cause: undefined })
    t.false('cause' in error)
    t.is(error.message, outerMessage)
  })

  test(`ErrorClass with cause of subclass use child class and instance | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const cause = new TestError('causeMessage')
    const error = new ErrorClass('message', { cause })
    assertInstanceOf(t, error, TestError)
    t.is(error, cause)
  })

  test(`ErrorClass with cause of superclass use parent class | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    const cause = new ErrorClass('causeMessage')
    const error = new TestError('message', { cause })
    assertInstanceOf(t, error, TestError)
    t.not(error, cause)
  })
})

each(ErrorClasses, getUnknownErrors(), ({ title }, ErrorClass, getError) => {
  test(`Unknown cause uses parent class and instance | ${title}`, (t) => {
    const cause = getError()
    const error = new ErrorClass('message', { cause })
    assertInstanceOf(t, error, ErrorClass)
    t.not(error, cause)
  })
})
