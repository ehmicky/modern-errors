import test from 'ava'
import { each } from 'test-each'

import {
  createAnyError,
  defineClassOpts,
  defineSimpleCustom,
  defineDeepCustom,
  defineClassesOpts,
} from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()
const { SimpleCustomError, AnyError: CustomAnyError } = defineSimpleCustom()
const { TestError: DeepCustomError, SimpleCustomError: DeepCustomParentError } =
  defineDeepCustom()

each([AnyError, TestError], ({ title }, ParentError) => {
  test(`Custom option defaults to parent class | ${title}`, (t) => {
    t.is(
      Object.getPrototypeOf(ParentError.subclass(`Default${ParentError.name}`)),
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

test('instanceof AnyError works with custom classes', (t) => {
  t.true(new SimpleCustomError('test') instanceof CustomAnyError)
})

test('instanceof ParentError works with deep custom classes', (t) => {
  t.true(new DeepCustomError('test') instanceof DeepCustomParentError)
})

test('Parent class is custom class when passed', (t) => {
  t.is(Object.getPrototypeOf(SimpleCustomError).name, SimpleCustomError.name)
})

class NullClass {}
// eslint-disable-next-line fp/no-mutating-methods
Object.setPrototypeOf(NullClass, null)

test('"custom" option is not modified', (t) => {
  const { OtherTestError } = defineClassesOpts((TestAnyError) => ({
    OtherTestError: {
      custom: class ReadonlyClass extends TestAnyError {},
    },
  }))
  t.is(Object.getPrototypeOf(OtherTestError).name, 'ReadonlyClass')
})

test('"custom" option can be shared', (t) => {
  const { TwoError } = defineClassesOpts((TestAnyError) => {
    class Parent extends TestAnyError {}
    return { OneError: { custom: Parent }, TwoError: { custom: Parent } }
  })
  t.is(Object.getPrototypeOf(TwoError).name, 'Parent')
})

test('Cannot use "custom" with UnknownError', (t) => {
  const TestAnyError = createAnyError()
  t.throws(() =>
    TestAnyError.subclass('UnknownError', {
      custom: class extends TestAnyError {},
    }),
  )
})

test('Can use "custom" with UnknownError children', (t) => {
  const ChildUnknownError = UnknownError.subclass('ChildUnknownError', {
    custom: class extends UnknownError {
      static prop = true
    },
  })
  t.true(ChildUnknownError.prop)
})

test('"custom" option can override error core properties', (t) => {
  const { OtherTestError } = defineClassesOpts((TestAnyError) => ({
    OtherTestError: {
      custom: class extends TestAnyError {
        message = 'one'
      },
    },
  }))
  t.is(new OtherTestError('two').message, 'one')
})
