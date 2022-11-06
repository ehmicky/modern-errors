import test from 'ava'
import { each } from 'test-each'

import { getClasses, ModernError } from './helpers/main.js'
import { getUnknownErrors } from './helpers/unknown.js'

const { ErrorClasses, ErrorSubclasses } = getClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`instanceof can be used with known errors | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.true(error instanceof Error)
    t.true(error instanceof ErrorClass)
    t.true(error instanceof ModernError)
  })
})

each(getUnknownErrors(), ({ title }, getUnknownError) => {
  test(`instanceof AnyError can be used with known errors | ${title}`, (t) => {
    t.false(getUnknownError() instanceof ModernError)
  })
})

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`instanceof prevents naming collisions | ${title}`, (t) => {
    const OtherAnyError = ModernError.subclass(ErrorClass.name)
    t.false(new OtherAnyError('test') instanceof ErrorClass)
  })
})
