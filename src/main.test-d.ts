import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { AnyError, BaseError } from './main.js'

type TestBaseErrorClass = BaseError<'TestError'>
type TestBaseErrorInstance = InstanceType<TestBaseErrorClass>
type UnknownBaseErrorClass = BaseError<'UnknownError'>
type UnknownBaseErrorInstance = InstanceType<UnknownBaseErrorClass>

const { TestError, UnknownError, AnyError } = modernErrors({
  TestError: { custom: class extends Error {} },
  UnknownError: {},
})
type TestErrorClass = typeof TestError
type TestErrorInstance = InstanceType<TestErrorClass>
type UnknownErrorClass = typeof UnknownError
type UnknownErrorInstance = InstanceType<UnknownErrorClass>
type AnyErrorClass = typeof AnyError
type AnyErrorInstance = InstanceType<AnyErrorClass>

expectError(modernErrors(true))
expectError(modernErrors())
expectError(modernErrors({}))
expectError(modernErrors({ TestError: {} }))
expectError(modernErrors({ TestError: undefined, UnknownError: {} }))
expectError(modernErrors({ AnyError: undefined, UnknownError: {} }))

const testError = new TestError('')
expectType<TestErrorInstance>(testError)
expectAssignable<TestBaseErrorInstance>(testError)
expectAssignable<AnyErrorInstance>(testError)
expectAssignable<Error>(testError)
expectType<'TestError'>(testError.name)

const unknownError = new UnknownError('')
expectType<UnknownErrorInstance>(unknownError)
expectType<UnknownBaseErrorInstance>(unknownError)
expectAssignable<AnyErrorInstance>(unknownError)
expectAssignable<Error>(unknownError)
expectType<'UnknownError'>(unknownError.name)

expectAssignable<TestErrorClass | UnknownErrorClass>(AnyError)
expectAssignable<TestBaseErrorClass | UnknownBaseErrorClass>(AnyError)

const anyError = new AnyError('')
expectType<AnyErrorInstance>(anyError)
expectType<TestErrorInstance | UnknownErrorInstance>(anyError)
expectType<typeof testError | typeof unknownError>(anyError)
expectAssignable<TestBaseErrorInstance | UnknownBaseErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectType<'TestError' | 'UnknownError'>(anyError.name)

const normalizedError = AnyError.normalize('')
expectType<AnyErrorInstance>(normalizedError)
expectError(AnyError.normalize('', true))
expectType<TestErrorInstance | UnknownErrorInstance>(normalizedError)
expectType<typeof testError | typeof unknownError>(normalizedError)
expectAssignable<TestBaseErrorInstance | UnknownBaseErrorInstance>(
  normalizedError,
)
expectAssignable<Error>(normalizedError)
expectType<'TestError' | 'UnknownError'>(normalizedError.name)

if (anyError.name === 'TestError') {
  expectType<TestErrorInstance>(anyError)
}
if (testError.name === 'TestError') {
  expectType<TestErrorInstance>(testError)
}
if (anyError.name === 'UnknownError') {
  expectType<UnknownErrorInstance>(anyError)
}
// TODO: fix
/*
if (anyError instanceof TestError) {
  expectType<TestErrorInstance>(anyError)
}
*/
if (testError instanceof TestError) {
  expectType<TestErrorInstance>(testError)
}

// TODO: fix
/*
if (anyError instanceof UnknownError) {
  expectType<UnknownErrorInstance>(anyError)
}
if (testError instanceof UnknownError) {
  expectType<never>(testError)
}
*/

if (anyError instanceof AnyError) {
  expectType<TestErrorInstance | UnknownErrorInstance>(anyError)
}
if (testError instanceof AnyError) {
  expectType<TestErrorInstance>(testError)
}
if (anyError instanceof Error) {
  expectType<TestErrorInstance | UnknownErrorInstance>(anyError)
}
if (testError instanceof Error) {
  expectType<TestErrorInstance>(testError)
}

expectError(
  modernErrors({
    TestError: { custom: class extends Object {} },
    UnknownError: {},
  }).TestError,
)
expectError(Error as BaseError<'InvalidName'>)
expectError(Error as BaseError)

const { OneError } = modernErrors({
  OneError: {
    custom: class extends Error {
      prop = true as const
    },
  },
  UnknownError: {},
})
expectType<true>(new OneError('message').prop)
