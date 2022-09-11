import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

each(
  [undefined, [], {}, { TestError: {} }, { UnknownError: true }],
  ({ title }, ErrorClasses) => {
    test(`Validate invalid ErrorClasses | ${title}`, (t) => {
      t.throws(modernErrors.bind(undefined, ErrorClasses))
    })
  },
)
