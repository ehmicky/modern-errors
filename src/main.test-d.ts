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
  ErrorInstance,
  ErrorConstructor,
  ErrorParams,
} from './main.js'

const result = modernErrors(['TestError'])
const { TestError, errorHandler, parse } = result

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

modernErrors([], { onCreate: (_: ErrorInstance, __: { test?: boolean }) => {} })
expectError(modernErrors([], { onCreate: true }))
expectError(modernErrors([], { onCreate: (_: boolean) => {} }))

expectAssignable<Result>(modernErrors([]))
expectNotAssignable<Result>({})
expectNotAssignable<Result>({ test: true })
expectAssignable<Result['TestError']>(TestError)
expectError(result.OtherError)

const error = new TestError('test')
expectAssignable<ErrorInstance>(error)
expectType<'TestError'>(error.name)

expectAssignable<ErrorHandler>(errorHandler)
expectType<typeof error>(errorHandler(undefined))
expectType<typeof error>(errorHandler(new Error('test')))
expectError(errorHandler(new Error('test'), true))
expectAssignable<ErrorHandler>(() => new TestError('test'))
expectNotAssignable<ErrorHandler>(() => {})

expectAssignable<ErrorName>('InputError')
expectNotAssignable<ErrorName>('test')
expectNotAssignable<ErrorName>(Symbol('InputError'))

expectAssignable<ErrorConstructor>(TestError)
expectNotAssignable<ErrorConstructor>(() => {})

const { InputError } = modernErrors(['InputError'], {
  onCreate: (_: ErrorInstance, __: { test?: boolean }) => {},
})
new InputError('message', { test: true })
expectError(new InputError('message', { test: 'true' }))
expectError(new InputError('message', { other: true }))
expectAssignable<ErrorParams>({ anyProp: true })
expectNotAssignable<ErrorParams>(true)

modernErrors(['TestError'], {
  onCreate: (_: ErrorInstance & { name: 'TestError' }) => {},
})
expectError(
  modernErrors(['TestError'], {
    onCreate: (_: ErrorInstance & { name: 'OtherError' }) => {},
  }),
)

expectType<Parse>(parse)
expectType<true>(parse(true))
expectType<Set<never>>(parse(new Set([])))
expectType<Error>(parse(new Error('test')))
expectNotType<Error>(parse({ name: 'InputError', message: '' }))
expectType<Error>(parse({ name: 'InputError', message: '', stack: '' }))

const errorObject = error.toJSON()
expectAssignable<ErrorObject>(errorObject)
expectType<'TestError'>(errorObject.name)
expectType<Error>(parse(errorObject))
