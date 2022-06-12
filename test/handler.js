import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

test('errorHandler() normalizes errors', (t) => {
  t.true(modernErrors().errorHandler() instanceof Error)
})

test('errorHandler() merges error.cause', (t) => {
  const error = new Error('test', { cause: new Error('cause') })
  t.is(modernErrors().errorHandler(error).message, 'cause\ntest')
})

test('errorHandler() keeps error type if listed', (t) => {
  const { InputError, errorHandler } = modernErrors()
  t.is(errorHandler(new InputError('test')).name, 'InputError')
})

test('errorHandler() uses InternalError if not listed', (t) => {
  const { errorHandler } = modernErrors()
  const { name, message } = errorHandler(new Error('test'))
  t.is(name, 'InternalError')
  t.is(message, 'test')
})

each([import.meta.url, new URL(import.meta.url)], ({ title }, bugsUrl) => {
  test(`InternalError uses bugsUrl if defined | ${title}`, (t) => {
    const { errorHandler } = modernErrors({ bugsUrl })
    const { message } = errorHandler(new Error('test'))
    t.true(message.startsWith('test\n'))
    t.true(message.includes(String(bugsUrl)))
  })
})

test('Subclassing errors is not supported', (t) => {
  const { errorHandler, InputError } = modernErrors()
  // eslint-disable-next-line fp/no-class
  class InputChildError extends InputError {}
  t.not(errorHandler(new InputError('test')).name, 'InternalError')
  t.is(errorHandler(new InputChildError('test')).name, 'InternalError')
})
