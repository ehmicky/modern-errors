import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { AnyError, TestError } = defineClassOpts()

each([AnyError, TestError], [undefined, {}], ({ title }, ErrorClass, opts) => {
  test(`Allows empty options | ${title}`, (t) => {
    // eslint-disable-next-line max-nested-callbacks
    t.notThrows(() => new ErrorClass('test', opts))
  })
})

each(
  [AnyError, TestError],
  [null, '', { custom: true }],
  ({ title }, ErrorClass, opts) => {
    test(`Validate against invalid options | ${title}`, (t) => {
      // eslint-disable-next-line max-nested-callbacks
      t.throws(() => new ErrorClass('test', opts))
    })
  },
)
