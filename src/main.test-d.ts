import modernErrors, { ErrorHandler, Options, Result } from 'modern-errors'
import {
  expectType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

expectType<Result>(modernErrors())
modernErrors({})
modernErrors({ bugsUrl: '' })
modernErrors({ bugsUrl: new URL('') })
modernErrors({ onCreate: (_: Error, __: { anyProp?: boolean }) => {} })
const { errorHandler } = modernErrors()
expectType<ErrorHandler>(errorHandler)

expectError(modernErrors(true))
expectError(modernErrors({ bugsUrl: true }))
expectError(modernErrors({ onCreate: true }))
expectError(modernErrors({ onCreate: (_: boolean) => {} }))

expectAssignable<Options>({ bugsUrl: '' })
expectNotAssignable<Options>({ bugsUrl: true })

expectAssignable<ErrorHandler>(() => new Error('test'))
expectNotAssignable<ErrorHandler>(() => {})

expectAssignable<Result>({ errorHandler: () => new Error('test') })
expectNotAssignable<Result>({ errorHandler: () => {} })
