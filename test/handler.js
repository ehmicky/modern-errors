import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

test('onError() normalizes errors', (t) => {
  t.true(modernErrors([]).onError() instanceof Error)
})

test('onError() merges error.cause', (t) => {
  const error = new Error('test', { cause: new Error('cause') })
  t.is(modernErrors([]).onError(error).message, 'cause\ntest')
})

test('onError() keeps error type if listed', (t) => {
  const { InputError, onError } = modernErrors(['InputError'])
  t.is(onError(new InputError('test')).name, 'InputError')
})

test('onError() uses SystemError if not listed', (t) => {
  const { onError } = modernErrors(['InputError'])
  const { name, message } = onError(new Error('test'))
  t.is(name, 'SystemError')
  t.is(message, 'test')
})

each([import.meta.url, new URL(import.meta.url)], ({ title }, bugsUrl) => {
  test(`SystemError uses bugsUrl if defined | ${title}`, (t) => {
    const { onError } = modernErrors([], { bugsUrl })
    const { message } = onError(new Error('test'))
    t.true(message.startsWith('test\n'))
    t.true(message.includes(String(bugsUrl)))
  })
})

test('Subclassing errors is not supported', (t) => {
  const { onError, InputError } = modernErrors(['InputError'])
  // eslint-disable-next-line unicorn/custom-error-definition, fp/no-class
  class InputChildError extends InputError {}
  t.not(onError(new InputError('test')).name, 'SystemError')
  t.is(onError(new InputChildError('test')).name, 'SystemError')
})
