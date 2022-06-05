import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

each(
  [
    undefined,
    true,
    'InputError',
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

test('Creates error types', (t) => {
  const { InputError } = modernErrors(['InputError'])
  const error = new InputError('message')
  t.true(error instanceof Error)
  t.true(error instanceof InputError)
  t.is(error.name, 'InputError')
  t.is(error.message, 'message')
})
