import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../../helpers/main.js'
import { getUnknownErrors } from '../../helpers/unknown.js'

const { ErrorClasses } = getClasses()

each(
  ErrorClasses,
  getUnknownErrors(),
  ({ title }, ErrorClass, getUnknownError) => {
    test(`ErrorClass.normalize() changes error class if unknown | ${title}`, (t) => {
      t.true(ErrorClass.normalize(getUnknownError()) instanceof ErrorClass)
    })

    test(`ErrorClass.normalize(error, TestError) changes error class if unknown | ${title}`, (t) => {
      const TestError = ErrorClass.subclass('TestError')
      t.true(
        ErrorClass.normalize(getUnknownError(), TestError) instanceof TestError,
      )
    })
  },
)
