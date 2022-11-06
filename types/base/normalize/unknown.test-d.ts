import { expectType, expectAssignable } from 'tsd'

import modernErrors, { ErrorInstance } from 'modern-errors'

const BaseError = modernErrors()
type BaseInstance = InstanceType<typeof BaseError>

const unknownError = new BaseError('', { cause: '' })
type UnknownInstance = typeof unknownError

expectType<Error>(unknownError)
expectAssignable<ErrorInstance>(unknownError)
expectType<BaseInstance>(unknownError)
expectType<UnknownInstance>(unknownError)

expectType<UnknownInstance>(new BaseError('', { cause: unknownError }))
expectType<UnknownInstance>(BaseError.normalize(unknownError))
expectType<UnknownInstance>(new BaseError('', { cause: new Error('') }))
expectType<UnknownInstance>(BaseError.normalize(new Error('')))
expectType<UnknownInstance>(new BaseError('', { cause: undefined }))
expectType<UnknownInstance>(BaseError.normalize(undefined))
expectType<UnknownInstance>(new BaseError('', { cause: '' }))
expectType<UnknownInstance>(BaseError.normalize(''))
