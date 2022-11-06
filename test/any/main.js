import test from 'ava'
import { each } from 'test-each'

import {
  SpecificErrorClasses,
  getUnknownErrors,
  ModernError,
  AnyError,
} from '../helpers/known.js'

each(SpecificErrorClasses, ({ title }, ErrorClass) => {
  test(`instanceof AnyError can be used with known errors | ${title}`, (t) => {
    t.true(new ErrorClass('test') instanceof AnyError)
  })
})

each(getUnknownErrors(), ({ title }, getUnknownError) => {
  test(`instanceof AnyError can be used with known errors | ${title}`, (t) => {
    t.false(getUnknownError() instanceof AnyError)
  })
})

test('instanceof AnyError prevents naming collisions', (t) => {
  const OtherAnyError = ModernError.subclass('OtherAnyError')
  t.false(new OtherAnyError('test') instanceof AnyError)
})

test('AnyError.prototype.name is correct', (t) => {
  t.is(AnyError.prototype.name, 'AnyError')
  t.false(
    Object.getOwnPropertyDescriptor(AnyError.prototype, 'name').enumerable,
  )
})
