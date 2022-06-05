import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

each(
  [
    undefined,
    true,
    [true],
    ['SystemError'],
    ['InputError', 'SystemError'],
    ['Error'],
    ['TypeError'],
    ['inputError'],
  ],
  ({ title }, errorNames) => {
    test(`Validate error names | ${title}`, (t) => {
      t.throws(modernErrors.bind(undefined, errorNames))
    })
  },
)
