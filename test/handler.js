import test from 'ava'
import modernErrors from 'modern-errors'

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

test('SystemError uses bugsUrl if defined', (t) => {
  const bugsUrl = import.meta.url
  const { onError } = modernErrors([], { bugsUrl })
  const { message } = onError(new Error('test'))
  t.true(message.startsWith('test\n'))
  t.true(message.includes(bugsUrl))
})
