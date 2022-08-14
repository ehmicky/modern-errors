import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

// eslint-disable-next-line unicorn/no-null
each([true, null], ({ title }, opts) => {
  test(`Validate options | ${title}`, (t) => {
    t.throws(modernErrors.bind(undefined, opts))
  })
})
