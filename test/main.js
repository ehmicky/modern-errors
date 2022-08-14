import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

// eslint-disable-next-line unicorn/no-null
each([[], ['InputError'], [[], true], [[], null]], ({ title }, args) => {
  test(`Validate arguments | ${title}`, (t) => {
    t.throws(modernErrors.bind(undefined, ...args))
  })
})

test('Creates error types', (t) => {
  const { InputError } = modernErrors(['InputError'])
  const error = new InputError('message')
  t.true(error instanceof Error)
  t.true(error instanceof InputError)
  t.is(error.name, 'InputError')
  t.is(error.message, 'message')
})

test('Passes onCreate()', (t) => {
  const { InputError } = modernErrors(['InputError'], {
    onCreate(error, params) {
      error.args = params
    },
  })
  const {
    args: { prop },
  } = new InputError('message', { prop: true })
  t.true(prop)
})

test('errorHandler() merges error.cause', (t) => {
  const error = new Error('test', { cause: new Error('cause') })
  t.is(modernErrors([]).errorHandler(error).message, 'cause\ntest')
})

test('errorHandler() keeps error type if listed', (t) => {
  const { InputError, errorHandler } = modernErrors(['InputError'])
  t.is(errorHandler(new InputError('test')).name, 'InputError')
})

test('errorHandler() uses UnknownError if not listed', (t) => {
  const { errorHandler } = modernErrors([])
  const { name, message } = errorHandler(new Error('test'))
  t.is(name, 'UnknownError')
  t.is(message, 'test')
})

test('UnknownError uses bugsUrl if defined', (t) => {
  const bugsUrl = import.meta.url
  const { errorHandler } = modernErrors([], { bugsUrl })
  const { message } = errorHandler(new Error('test'))
  t.true(message.startsWith('test\n'))
  t.true(message.includes(bugsUrl))
})
