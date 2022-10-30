import { expectType } from 'tsd'

import modernErrors, { ErrorInstance } from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const unknownError = new AnyError('', { cause: '' })
type UnknownInstance = typeof unknownError

expectType<Error>(unknownError)
expectType<ErrorInstance>(unknownError)
expectType<AnyInstance>(unknownError)
expectType<UnknownInstance>(unknownError)

expectType<UnknownInstance>(new AnyError('', { cause: unknownError }))
expectType<UnknownInstance>(AnyError.normalize(unknownError))
expectType<UnknownInstance>(new AnyError('', { cause: new Error('') }))
expectType<UnknownInstance>(AnyError.normalize(new Error('')))
expectType<UnknownInstance>(new AnyError('', { cause: undefined }))
expectType<UnknownInstance>(AnyError.normalize(undefined))
expectType<UnknownInstance>(new AnyError('', { cause: '' }))
expectType<UnknownInstance>(AnyError.normalize(''))