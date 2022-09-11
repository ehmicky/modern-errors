import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass } from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()

each([TestError, AnyError], ({ title }, ErrorClass) => {
  test(`"cause" is merged | ${title}`, (t) => {
    const outerMessage = 'message'
    const innerMessage = 'causeMessage'
    const error = new ErrorClass(outerMessage, { cause: innerMessage })
    t.false('cause' in error)
    t.is(error.message, `${innerMessage}\n${outerMessage}`)
  })

  test(`"cause" can have undefined value | ${title}`, (t) => {
    const outerMessage = 'message'
    const error = new ErrorClass(outerMessage, { cause: undefined })
    t.false('cause' in error)
    t.is(error.message, outerMessage)
  })
})
