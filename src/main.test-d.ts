import modernErrors, { ErrorHandler, Options, Result } from 'modern-errors'
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
modernErrors({ onCreate: (_: Error, __: { anyProp?: boolean }) => {} })
expectError(modernErrors({ onCreate: true }))
expectError(modernErrors({ onCreate: (_: boolean) => {} }))
expectAssignable<Options>({ bugsUrl: '' })
expectNotAssignable<Options>({ bugsUrl: true })

const { errorHandler } = modernErrors()
expectType<ErrorHandler>(errorHandler)
expectType<Error>(errorHandler(undefined))
expectType<Error>(errorHandler(new Error('test')))
expectAssignable<ErrorHandler>(() => new Error('test'))
expectNotAssignable<ErrorHandler>(() => {})
