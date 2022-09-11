import {
  expectType,
  expectNotType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

import modernErrors, { AnyError, BaseError, Options } from './main.js'

class TestError extends (Error as BaseError<'TestError'>) {}
class UnknownError extends (Error as BaseError<'UnknownError'>) {}
const AnyError = modernErrors([TestError, UnknownError])

expectError(class InvalidName extends (Error as BaseError<'InvalidName'>) {})
expectError(class NoName extends (Error as BaseError) {})

expectError(modernErrors())
expectError(modernErrors(UnknownError))
expectError(modernErrors([TestError, UnknownError, true]))
expectError(modernErrors([TestError, UnknownError], {}))

expectType<never>(modernErrors([]))
expectType<never>(modernErrors([TestError]))
expectNotType<never>(modernErrors([UnknownError]))

expectAssignable<typeof TestError | typeof UnknownError>(AnyError)
expectAssignable<BaseError<'TestError' | 'UnknownError'>>(AnyError)

const testError = new TestError('')
expectType<TestError>(testError)
expectAssignable<InstanceType<BaseError<'TestError' | 'UnknownError'>>>(
  testError,
)
expectAssignable<InstanceType<typeof AnyError>>(testError)
expectAssignable<typeof testError>(testError)
expectAssignable<Error>(testError)
expectType<'TestError'>(testError.name)

const unknownError = new UnknownError('')
expectType<UnknownError>(unknownError)
expectAssignable<InstanceType<BaseError<'TestError' | 'UnknownError'>>>(
  unknownError,
)
expectAssignable<InstanceType<typeof AnyError>>(unknownError)
expectAssignable<typeof unknownError>(unknownError)
expectAssignable<Error>(unknownError)
expectType<'UnknownError'>(unknownError.name)

const anyError = new AnyError('')
expectType<TestError | UnknownError>(anyError)
expectAssignable<InstanceType<BaseError<'TestError' | 'UnknownError'>>>(
  anyError,
)
expectAssignable<InstanceType<typeof AnyError>>(anyError)
expectAssignable<typeof testError | typeof unknownError>(anyError)
expectAssignable<Error>(anyError)
expectType<'TestError' | 'UnknownError'>(anyError.name)

const normalizedError = AnyError.normalize('')
expectError(AnyError.normalize('', true))
expectType<TestError | UnknownError>(normalizedError)
expectAssignable<InstanceType<BaseError<'TestError' | 'UnknownError'>>>(
  normalizedError,
)
expectAssignable<InstanceType<typeof AnyError>>(normalizedError)
expectAssignable<typeof testError | typeof unknownError>(normalizedError)
expectAssignable<Error>(normalizedError)
expectType<'TestError' | 'UnknownError'>(normalizedError.name)

if (anyError.name === 'TestError') {
  expectType<TestError>(anyError)
}
if (testError.name === 'TestError') {
  expectType<TestError>(testError)
}
if (anyError.name === 'UnknownError') {
  expectType<UnknownError>(anyError)
}
if (anyError instanceof TestError) {
  expectType<TestError>(anyError)
}
if (testError instanceof TestError) {
  expectType<TestError>(testError)
}
if (anyError instanceof UnknownError) {
  expectType<UnknownError>(anyError)
}
if (testError instanceof UnknownError) {
  expectType<never>(testError)
}
if (anyError instanceof AnyError) {
  expectType<TestError | UnknownError>(anyError)
}
if (testError instanceof AnyError) {
  expectType<TestError>(testError)
}
if (anyError instanceof Error) {
  expectType<TestError | UnknownError>(anyError)
}
if (testError instanceof Error) {
  expectType<TestError>(testError)
}

expectNotAssignable<Options>({ test: true })

new TestError('', { bugs: 'test' })
new UnknownError('', { bugs: 'test' })
new AnyError('', { cause: testError, bugs: 'test' })
expectAssignable<Options>({ bugs: 'test' })
new TestError('', { bugs: new URL('https://example.com/test') })
expectAssignable<Options>({ bugs: new URL('https://example.com/test') })
expectError(new TestError('', { bugs: true }))
expectNotAssignable<Options>({ bugs: true })

new TestError('', { props: { test: true } })
new UnknownError('', { props: { test: true } })
new AnyError('', { props: { test: true } })
expectAssignable<Options>({ props: { test: true } })
expectError(new TestError('', { props: true }))
expectError(new TestError('', { props: { message: true } }))
expectNotAssignable<Options>({ props: true })
