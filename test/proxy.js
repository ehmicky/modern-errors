import test from 'ava'
import modernErrors from 'modern-errors'

test('Can enumerate new error types', (t) => {
  const returnValue = modernErrors()
  t.deepEqual(Object.keys(returnValue), ['errorHandler'])
  t.false('InputError' in returnValue)
  t.true(new returnValue.InputError('test') instanceof Error)
  t.deepEqual(Object.keys(returnValue), ['errorHandler', 'InputError'])
  t.true('InputError' in returnValue)
})
