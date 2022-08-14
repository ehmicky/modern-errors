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
  ErrorObject,
  CustomError,
  ErrorParams,
} from './main.js'

const result = modernErrors(['TestError'])
const { TestError, errorHandler, parse } = result
const testError = new TestError('test')

expectError(modernErrors())
expectError(modernErrors('TestError'))
expectError(modernErrors(['Test']))

modernErrors([])
modernErrors([], {})
expectError(modernErrors([], true))
expectAssignable<Options>({ bugsUrl: '' })
expectNotAssignable<Options>({ test: true })

modernErrors([], { bugsUrl: '' })
modernErrors([], { bugsUrl: new URL('') })
expectError(modernErrors([], { bugsUrl: true }))

modernErrors([], { onCreate: (_: CustomError, __: { test?: boolean }) => {} })
expectError(modernErrors([], { onCreate: true }))
expectError(modernErrors([], { onCreate: (_: boolean) => {} }))

expectAssignable<Result>(modernErrors([]))
expectNotAssignable<Result>({})
expectNotAssignable<Result>({ test: true })
expectAssignable<Result['TestError']>(TestError)
expectError(result.OtherError)

expectAssignable<CustomError>(testError)
expectType<CustomError<'TestError'>>(testError)
expectType<InstanceType<typeof TestError>>(testError)
expectType<typeof testError>(testError)
expectAssignable<Error>(testError)
expectType<'TestError'>(testError.name)

expectAssignable<ErrorHandler>(errorHandler)
expectType<CustomError<'TestError' | 'InternalError'>>(errorHandler(undefined))
expectType<CustomError<'TestError' | 'InternalError'>>(
  errorHandler(new Error('test')),
)
expectError(errorHandler(new Error('test'), true))
expectAssignable<ErrorHandler>(() => new TestError('test'))
expectNotAssignable<ErrorHandler>(() => {})

expectAssignable<ErrorName>('InputError')
expectNotAssignable<ErrorName>('test')
expectNotAssignable<ErrorName>(Symbol('InputError'))

expectNotAssignable<typeof CustomError>(TestError)
expectType<typeof CustomError<'TestError'>>(TestError)
expectType<typeof TestError>(TestError)
expectNotAssignable<typeof CustomError<'TestError'>>(Error)
expectNotAssignable<typeof CustomError>(() => {})

const { InputError } = modernErrors(['InputError'], {
  onCreate: (_: CustomError, __: { test?: boolean }) => {},
})
new InputError('message', { test: true })
expectError(new InputError('message', { test: 'true' }))
expectError(new InputError('message', { other: true }))
expectAssignable<ErrorParams>({ anyProp: true })
expectNotAssignable<ErrorParams>(true)

modernErrors(['TestError', 'TestTwoError'], {
  onCreate: (_: CustomError<'TestError' | 'TestTwoError'>) => {},
})

const { TestTwoError } = modernErrors(['TestTwoError'])
const testTwoError = new TestTwoError('message')
expectNotAssignable<typeof testError>(testTwoError)

expectType<Parse>(parse)
expectType<true>(parse(true))
expectType<Set<never>>(parse(new Set([])))
expectType<Error>(parse(new Error('test')))
expectNotType<Error>(parse({ name: 'InputError', message: '' }))
expectType<Error>(parse({ name: 'InputError', message: '', stack: '' }))

const errorObject = testError.toJSON()
expectAssignable<ErrorObject>(errorObject)
expectType<'TestError'>(errorObject.name)
expectType<Error>(parse(errorObject))
