import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { Plugin } from '../../main.js'

const AnyError = modernErrors()
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

const cause = {} as Error & { prop: true }
expectType<true>(new AnyError('', { cause }).prop)
expectType<true>(AnyError.normalize(cause).prop)

expectError(AnyError.normalize('', true))
