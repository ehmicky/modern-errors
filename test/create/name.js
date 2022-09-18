import test from 'ava'
import modernErrors from 'modern-errors'
import { each } from 'test-each'

each([undefined, '', {}], ({ title }, errorName) => {
  test(`Validate invalid error name | ${title}`, (t) => {
    t.throws(modernErrors().create.bind(undefined, errorName))
  })
})

test('Require defining UnknownError', (t) => {
  t.throws(modernErrors().create.bind(undefined, 'InputError'))
})

test('Validate against duplicate names', (t) => {
  const { create } = modernErrors()
  create('UnknownError')
  t.throws(create.bind(undefined, 'UnknownError'))
})
