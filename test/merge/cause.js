import test from 'ava'
import { each } from 'test-each'

import { getClasses, getUnknownErrors, ModernError } from '../helpers/main.js'

const { KnownErrorClasses, SpecificErrorClasses, AnyError } = getClasses()

const assertInstanceOf = function (t, error, ErrorClass) {
  t.true(error instanceof ErrorClass)
  t.is(Object.getPrototypeOf(error), ErrorClass.prototype)
  t.is(error.name, ErrorClass.name)
}

each(SpecificErrorClasses, ({ title }, ErrorClass) => {
  test(`Parent class with known cause uses child class and instance | ${title}`, (t) => {
    const cause = new ErrorClass('causeMessage')
    const error = new ModernError('message', { cause })
    assertInstanceOf(t, error, cause.constructor)
    t.is(error, cause)
  })
})

each(KnownErrorClasses, ({ title }, ErrorClass) => {
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
})

each(
  KnownErrorClasses,
  getUnknownErrors(),
  ({ title }, ErrorClass, getError) => {
    test(`Unknown cause uses parent class and instance | ${title}`, (t) => {
      const cause = getError()
      const error = new ErrorClass('message', { cause })
      assertInstanceOf(t, error, ErrorClass)
      t.not(error, cause)
    })
  },
)

test('ErrorClass with cause of subclass use child class and instance', (t) => {
  const cause = new AnyError('causeMessage')
  const error = new ModernError('message', { cause })
  assertInstanceOf(t, error, AnyError)
  t.is(error, cause)
})

test('ErrorClass with cause of superclass use parent class', (t) => {
  const cause = new ModernError('causeMessage')
  const error = new AnyError('message', { cause })
  assertInstanceOf(t, error, AnyError)
  t.not(error, cause)
})
