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

expectType<Result>(modernErrors())
expectAssignable<Result>({ errorHandler: () => new Error('test') })
expectNotAssignable<Result>({ errorHandler: () => {} })

modernErrors({})
expectError(modernErrors(true))
modernErrors({ bugsUrl: '' })
modernErrors({ bugsUrl: new URL('') })
expectError(modernErrors({ bugsUrl: true }))
expectAssignable<Options>({ bugsUrl: '' })
expectNotAssignable<Options>({ bugsUrl: true })

modernErrors({ onCreate: (_: Error, __: { anyProp?: boolean }) => {} })
expectError(modernErrors({ onCreate: true }))
expectError(modernErrors({ onCreate: (_: boolean) => {} }))
expectAssignable<OnCreate>((_: Error, __: { anyProp?: boolean }) => {})
expectNotAssignable<OnCreate>((_: boolean) => {})

const { errorHandler } = modernErrors()
expectType<ErrorHandler>(errorHandler)
expectType<Error>(errorHandler(undefined))
expectType<Error>(errorHandler(new Error('test')))
expectAssignable<ErrorHandler>(() => new Error('test'))
expectNotAssignable<ErrorHandler>(() => {})

const result = modernErrors()
expectError(result.anything)
expectAssignable<ErrorName>('InputError')
expectNotAssignable<ErrorName>('anything')
expectNotAssignable<ErrorName>(Symbol('InputError'))

const { InputError } = modernErrors()
expectAssignable<ErrorType>(InputError)
expectNotAssignable<ErrorType>(() => {})
