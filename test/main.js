import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses } from './helpers/known.js'

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`Can use known error classes | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.true(error instanceof ErrorClass)
    t.true(error instanceof Error)
  })
})
