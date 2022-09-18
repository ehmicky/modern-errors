import test from 'ava'
import { each } from 'test-each'

import { createAnyError, defineSimpleClass } from '../helpers/main.js'

const { AnyError } = defineSimpleClass()

test('Require defining UnknownError', (t) => {
  const { create } = createAnyError()
  t.throws(create.bind(undefined, 'InputError'))
})

test('Validate against duplicate names', (t) => {
  t.throws(AnyError.create.bind(undefined, 'TestError'))
})

each([undefined, '', {}, 'AnyError'], ({ title }, errorName) => {
  test(`Validate invalid error name | ${title}`, (t) => {
    t.throws(AnyError.create.bind(undefined, errorName))
  })
})
