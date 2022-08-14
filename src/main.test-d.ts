import {
  expectType,
  expectNotType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

import modernErrors, {
  ErrorHandler,
  Parse,
  Options,
  Result,
  ErrorName,
  OnCreate,
  ErrorObject,
  ErrorType,
} from './main.js'

const result = modernErrors()
const { TestError, errorHandler, parse } = result

modernErrors()
modernErrors({})
expectError(modernErrors(true))
expectAssignable<Options>({ bugsUrl: '' })
expectNotAssignable<Options>({ test: true })

modernErrors({ bugsUrl: '' })
modernErrors({ bugsUrl: new URL('') })
expectError(modernErrors({ bugsUrl: true }))

modernErrors({ onCreate: (_: ErrorType, __: { test?: boolean }) => {} })
expectError(modernErrors({ onCreate: true }))
expectError(modernErrors({ onCreate: (_: boolean) => {} }))
expectAssignable<OnCreate>((_: ErrorType, __: { test?: boolean }) => {})
expectNotAssignable<OnCreate>((_: boolean) => {})

expectType<Result>(modernErrors())
expectNotAssignable<Result>({})
expectNotAssignable<Result>({ test: true })
expectAssignable<Result['TestError']>(TestError!)

expectType<ErrorHandler>(errorHandler)
expectType<ErrorType>(errorHandler(undefined))
expectType<ErrorType>(errorHandler(new Error('test')))
expectError(errorHandler(new Error('test'), true))
expectAssignable<ErrorHandler>(() => new TestError!('test'))
expectNotAssignable<ErrorHandler>(() => {})

expectType<Parse>(parse)
expectType<true>(parse(true))
expectType<Set<never>>(parse(new Set([])))
expectType<Error>(parse(new Error('test')))
expectNotType<Error>(parse({ name: 'InputError', message: '' }))
expectType<Error>(parse({ name: 'InputError', message: '', stack: '' }))

const error = new TestError!('test')
expectType<ErrorType>(error)
const errorObject = error.toJSON()
expectType<ErrorObject>(errorObject)
expectType<Error>(parse(errorObject))

expectError(result.test)
expectAssignable<ErrorName>('InputError')
expectNotAssignable<ErrorName>('test')
expectNotAssignable<ErrorName>(Symbol('InputError'))

expectAssignable<typeof ErrorType>(TestError!)
expectNotAssignable<typeof ErrorType>(() => {})

const { InputError } = modernErrors({
  onCreate: (_: ErrorType, __: { test?: boolean }) => {},
})
new InputError!('message', { test: true })
expectError(new InputError!('message', { test: 'true' }))
expectError(new InputError!('message', { other: true }))
