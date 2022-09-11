import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { BaseError } from './main.js'

type TestBaseErrorClass = BaseError<'TestError'>
type TestBaseErrorInstance = InstanceType<TestBaseErrorClass>
type UnknownBaseErrorClass = BaseError<'UnknownError'>
type UnknownBaseErrorInstance = InstanceType<UnknownBaseErrorClass>

const { TestError, UnknownError, AnyError } = modernErrors({
  TestError: {
    custom: class extends Error {
      constructor({ message, options }: { message: string; options?: object }) {
        super(message, options)
      }
      prop = true as const
      static staticProp = true as const
    },
  },
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

const testError = new TestError({ message: '' })
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
expectType<TestErrorInstance | UnknownErrorInstance>(anyError)
expectType<typeof testError | typeof unknownError>(anyError)
expectAssignable<TestBaseErrorInstance | UnknownBaseErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectType<'TestError' | 'UnknownError'>(anyError.name)
expectError(AnyError.staticProp)
if ('prop' in anyError) {
  expectType<true>(anyError.prop)
}

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
if ('prop' in normalizedError) {
  expectType<true>(normalizedError.prop)
}

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

if (anyError instanceof UnknownError) {
  expectType<UnknownErrorInstance>(anyError)
}

if (testError instanceof UnknownError) {
  expectType<never>(testError)
}

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

expectError(Error as BaseError<'InvalidName'>)
expectError(
  modernErrors({
    TestError: { custom: class extends Object {} },
    UnknownError: {},
  }).TestError,
)
modernErrors({
  TestError: { custom: class extends (Error as BaseError) {} },
  UnknownError: {},
})
modernErrors({
  TestError: { custom: class extends (Error as TestBaseErrorClass) {} },
  UnknownError: {},
})
