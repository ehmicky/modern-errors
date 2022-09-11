import test from 'ava'
import { setErrorName } from 'error-class-utils'
import { each } from 'test-each'

import { defineSimpleClass, defineClassesOpts } from '../helpers/main.js'

const { TestError, UnknownError } = defineSimpleClass()

test('Prevent instantiating BaseError', (t) => {
  const BaseError = Object.getPrototypeOf(TestError)
  t.throws(() => new BaseError('test'))
})

test('Prevent instantiating GlobalBaseError', (t) => {
  const { InputError } = defineClassesOpts({
    AnyError: { custom: class extends Error {} },
    InputError: {},
  })
  const GlobalBaseError = Object.getPrototypeOf(InputError)
  t.throws(() => new GlobalBaseError('test'))
})

each([TestError, UnknownError], ({ title }, ErrorClass) => {
  test(`Subclasses must be known | ${title}`, (t) => {
    class ChildError extends ErrorClass {}
    setErrorName(ChildError, 'ChildError')
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ChildError('test'))
  })
})
