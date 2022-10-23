import { expectType, expectAssignable, expectError } from 'tsd'
import type { ErrorName } from 'error-custom-class'

import modernErrors, { Plugin, ErrorInstance } from '../main.js'

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

expectError(AnyError.normalize('', true))

const SError = AnyError.subclass('SError')
const sError = new SError('')
type SInstance = typeof SError['prototype']

expectAssignable<SInstance>(new AnyError('', { cause: sError }))
expectAssignable<SInstance>(AnyError.normalize(sError))

const PAnyError = modernErrors([{ name: 'test' as const }])
const PSError = PAnyError.subclass('PSError')
const psError = new PSError('')
type PInstance = typeof PSError['prototype']

expectAssignable<PInstance>(new PAnyError('', { cause: psError }))
expectAssignable<PInstance>(PAnyError.normalize(psError))

const GPAnyError = modernErrors([{} as Plugin])

expectAssignable<PInstance>(new GPAnyError('', { cause: psError }))
expectAssignable<PInstance>(GPAnyError.normalize(psError))

if (unknownError instanceof AnyError) {
  expectAssignable<UnknownInstance>(unknownError)
}

const cause = {} as Error & { prop: true }
expectType<true>(new AnyError('', { cause }).prop)
expectType<true>(AnyError.normalize(cause).prop)
