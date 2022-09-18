import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from './helpers/main.js'

const { TestError, UnknownError } = defineClassOpts()

each([TestError, UnknownError], ({ title }, ErrorClass) => {
  test(`Can use known error classes | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.true(error instanceof ErrorClass)
    t.true(error instanceof Error)
  })
})

test('Can be called several times', (t) => {
  const { TestError: OtherTestError } = defineClassOpts()
  const error = new OtherTestError('test')
  t.true(error instanceof OtherTestError)
})
