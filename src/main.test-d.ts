import modernErrors, {
  ErrorHandler,
  Options,
  Result,
  ErrorName,
  OnCreate,
  ErrorType,
} from 'modern-errors'
import {
  expectType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

const result = modernErrors()
const { TestError, errorHandler } = result

modernErrors()
modernErrors({})
expectError(modernErrors(true))
expectAssignable<Options>({ bugsUrl: '' })
expectNotAssignable<Options>({ test: true })

modernErrors({ bugsUrl: '' })
modernErrors({ bugsUrl: new URL('') })
expectError(modernErrors({ bugsUrl: true }))

modernErrors({ onCreate: (_: Error, __: { test?: boolean }) => {} })
expectError(modernErrors({ onCreate: true }))
expectError(modernErrors({ onCreate: (_: boolean) => {} }))
expectAssignable<OnCreate>((_: Error, __: { test?: boolean }) => {})
expectNotAssignable<OnCreate>((_: boolean) => {})

expectType<Result>(modernErrors())
expectAssignable<Result>({ errorHandler: () => new Error('test') })
expectAssignable<Result>({
  errorHandler: () => new Error('test'),
  TestError,
})
expectNotAssignable<Result>({ errorHandler: () => {} })
expectNotAssignable<Result>({})
expectNotAssignable<Result>({ test: true })

expectType<ErrorHandler>(errorHandler)
expectType<Error>(errorHandler(undefined))
expectType<Error>(errorHandler(new Error('test')))
expectError(errorHandler(new Error('test'), true))
expectAssignable<ErrorHandler>(() => new Error('test'))
expectNotAssignable<ErrorHandler>(() => {})

expectError(result.test)
expectAssignable<ErrorName>('InputError')
expectNotAssignable<ErrorName>('test')
expectNotAssignable<ErrorName>(Symbol('InputError'))

expectAssignable<ErrorType>(TestError)
expectAssignable<ErrorType>(Error)
expectNotAssignable<ErrorType>(() => {})
