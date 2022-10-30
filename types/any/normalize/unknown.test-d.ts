import { expectType, expectAssignable } from 'tsd'
import type { ErrorName } from 'error-custom-class'

import modernErrors, { ErrorInstance } from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const unknownError = new AnyError('', { cause: '' })
type UnknownInstance = typeof unknownError

expectAssignable<Error>(unknownError)
expectAssignable<ErrorInstance>(unknownError)
expectAssignable<AnyInstance>(unknownError)
expectAssignable<UnknownInstance>(unknownError)

expectAssignable<UnknownInstance>(new AnyError('', { cause: unknownError }))
expectAssignable<UnknownInstance>(AnyError.normalize(unknownError))
expectAssignable<UnknownInstance>(new AnyError('', { cause: new Error('') }))
expectAssignable<UnknownInstance>(AnyError.normalize(new Error('')))
expectAssignable<UnknownInstance>(new AnyError('', { cause: undefined }))
expectAssignable<UnknownInstance>(AnyError.normalize(undefined))
expectAssignable<UnknownInstance>(new AnyError('', { cause: '' }))
expectAssignable<UnknownInstance>(AnyError.normalize(''))

expectType<'UnknownError'>(unknownError.name)
expectType<'UnknownError'>('' as UnknownInstance['name'])
expectType<ErrorName>({} as ReturnType<typeof AnyError.normalize>['name'])
