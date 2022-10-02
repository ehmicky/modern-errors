import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

test('Does not modify invalid classes', (t) => {
  class custom extends Object {}
  t.throws(defineClassOpts.bind(undefined, { custom }))
  t.false('name' in custom.prototype)
})

each([TestError, AnyError], ({ title }, ErrorClass) => {
  test(`Static methods are not enumerable | ${title}`, (t) => {
    t.deepEqual(Object.keys(ErrorClass), [])
  })
})
