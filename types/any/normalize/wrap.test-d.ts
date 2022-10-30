import { expectType, expectError } from 'tsd'

import modernErrors, { Plugin } from '../../main.js'

const AnyError = modernErrors()
const SError = AnyError.subclass('SError', {
  custom: class extends AnyError {
    prop = true
  },
})
const sError = new SError('')
type SInstance = typeof SError['prototype']

expectType<SInstance>(new AnyError('', { cause: sError }))
expectType<SInstance>(AnyError.normalize(sError))

const PAnyError = modernErrors([{ name: 'test' as const }])
const PSError = PAnyError.subclass('PSError', {
  custom: class extends PAnyError {
    prop = true
  },
})
const psError = new PSError('')
type PInstance = typeof PSError['prototype']

expectType<PInstance>(new PAnyError('', { cause: psError }))
expectType<PInstance>(PAnyError.normalize(psError))

const GPAnyError = modernErrors([{} as Plugin])

expectType<PInstance>(new GPAnyError('', { cause: psError }))
expectType<PInstance>(GPAnyError.normalize(psError))

const cause = {} as Error & { prop: true }
expectType<true>(new AnyError('', { cause }).prop)
expectType<true>(AnyError.normalize(cause).prop)

expectError(AnyError.normalize('', true))
