import test from 'ava'
import { each } from 'test-each'

import {
  defineSimpleClass,
  defineSimpleCustom,
  defineDeepCustom,
  defineClassesOpts,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()
const { SimpleCustomError } = defineSimpleCustom()
const { DeepCustomError } = defineDeepCustom()

each([AnyError, TestError], ({ title }, ParentError) => {
  test(`Custom option defaults to parent class | ${title}`, (t) => {
    t.is(
      Object.getPrototypeOf(ParentError.class(`Default${ParentError.name}`)),
      ParentError,
    )
  })
})

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Custom classes are inherited | ${title}`, (t) => {
    t.true(ErrorClass.staticProp)
    t.true(new ErrorClass('test').prop)
  })
})

test('Parent class is custom class when passed', (t) => {
  t.is(Object.getPrototypeOf(SimpleCustomError).name, SimpleCustomError.name)
})

class NullClass {}
// eslint-disable-next-line fp/no-mutating-methods, unicorn/no-null
Object.setPrototypeOf(NullClass, null)

test('"custom" option is not modified', (t) => {
  const { InputError } = defineClassesOpts((TestAnyError) => ({
    InputError: {
      custom: class ReadonlyClass extends TestAnyError {},
    },
  }))
  t.is(Object.getPrototypeOf(InputError).name, 'ReadonlyClass')
})

test('"custom" option can be shared', (t) => {
  const { TwoError } = defineClassesOpts((TestAnyError) => {
    class Parent extends TestAnyError {}
    return { OneError: { custom: Parent }, TwoError: { custom: Parent } }
  })
  t.is(Object.getPrototypeOf(TwoError).name, 'Parent')
})
