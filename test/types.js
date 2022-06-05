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

test('Default onCreate() assigns properties', (t) => {
  const { InputError } = modernErrors(['InputError'])
  const { prop } = new InputError('message', { prop: true })
  t.true(prop)
})

const ERROR_TYPES = {
  InputError(error, params) {
    error.params = params
  },
}

const onCreate = function (error, params) {
  ERROR_TYPES[error.name](error, params)
}

test('Can customize onCreate()', (t) => {
  const { InputError } = modernErrors(['InputError'], { onCreate })
  const {
    params: { prop },
  } = new InputError('message', { prop: true })
  t.true(prop)
})
