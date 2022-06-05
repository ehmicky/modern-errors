import test from 'ava'
import modernErrors from 'modern-errors'

test('onError() normalizes errors', (t) => {
  t.true(modernErrors([]).onError() instanceof Error)
})
