import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass } from './helpers/main.js'

const { TestError, UnknownError } = defineSimpleClass()

each([TestError, UnknownError], ({ title }, ErrorClass) => {
  test(`Can use known error classes | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.true(error instanceof ErrorClass)
    t.true(error instanceof Error)
  })
})

test('Can be called several times', (t) => {
  const { TestError: OtherTestError } = defineSimpleClass()
  const error = new OtherTestError('test')
  t.true(error instanceof OtherTestError)
})
