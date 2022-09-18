import { expectType, expectAssignable, expectError } from 'tsd'
import { ErrorName } from 'error-custom-class'

import modernErrors from './main.js'
import type { AnyError as AnyErrorType } from './main.js'

type AnyErrorInstance = AnyErrorType<ErrorName>
type AnyErrorClass = typeof AnyErrorType<ErrorName>
type TestBaseErrorInstance = AnyErrorType<'TestError'>
type TestBaseErrorClass = typeof AnyErrorType<'TestError'>
type UnknownBaseErrorInstance = AnyErrorType<'UnknownError'>

const { TestError, UnknownError, AnyError } = modernErrors({
  TestError: {
    custom: class extends (Error as any as TestBaseErrorClass) {
      constructor(message: string | boolean, options?: object) {
        super(String(message), options)
      }
      prop = true as const
      static staticProp = true as const
    },
  },
  UnknownError: {},
})
expectError(Error as any as AnyErrorType<'InvalidName'>)

type TestErrorClass = typeof TestError
type TestErrorInstance = InstanceType<TestErrorClass>
type UnknownErrorClass = typeof UnknownError
type UnknownErrorInstance = InstanceType<UnknownErrorClass>

expectError(modernErrors(true))
expectError(modernErrors())
expectError(modernErrors({}))
expectError(modernErrors({ TestError: {} }))
expectError(modernErrors({ TestError: undefined, UnknownError: {} }))
expectError(modernErrors({ AnyError: undefined, UnknownError: {} }))

const testError = new TestError(true)
expectType<TestErrorInstance>(testError)
expectAssignable<TestBaseErrorInstance>(testError)
expectAssignable<AnyErrorInstance>(testError)
expectAssignable<Error>(testError)
expectType<true>(TestError.staticProp)
expectType<'TestError'>(testError.name)
expectType<true>(testError.prop)

const unknownError = new UnknownError('')
expectType<UnknownErrorInstance>(unknownError)
expectType<UnknownBaseErrorInstance>(unknownError)
expectAssignable<AnyErrorInstance>(unknownError)
expectAssignable<Error>(unknownError)
expectError(UnknownError.staticProp)
expectType<'UnknownError'>(unknownError.name)
expectError(unknownError.prop)

const anyError = new AnyError('')
expectType<AnyErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectError(AnyError.staticProp)
expectError(anyError.prop)

expectType<AnyErrorInstance>(AnyError.normalize(''))
expectType<AnyErrorInstance>(TestError.normalize(''))
expectType<AnyErrorInstance>(UnknownError.normalize(''))
expectError(AnyError.normalize('', true))

if (anyError instanceof TestError) {
  expectType<TestErrorInstance>(anyError)
}
if (testError instanceof TestError) {
  expectType<TestErrorInstance>(testError)
}
/* TODO: fix
if (anyError instanceof UnknownError) {
  expectType<UnknownErrorInstance>(anyError)
}
if (testError instanceof UnknownError) {
  expectType<never>(testError)
}
*/
if (testError instanceof AnyError) {
  expectType<TestErrorInstance>(testError)
}
if (testError instanceof Error) {
  expectType<TestErrorInstance>(testError)
}
