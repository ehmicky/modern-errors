import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'

const AnyError = modernErrors()

const SError = AnyError.subclass('SError')
expectError(SError.normalize(''))

const SSError = SError.subclass('SSError')
expectError(SSError.normalize(''))

const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {
    static prop = true as const
  },
})
expectType<true>(CError.prop)

const SCError = CError.subclass('SCError')
expectType<true>(SCError.prop)

const CCError = CError.subclass('CCError', {
  custom: class extends CError {
    static deepProp = true as const
  },
})
expectType<true>(CCError.prop)
expectType<true>(CCError.deepProp)

const CSError = SError.subclass('CSError', {
  custom: class extends SError {
    static prop = true as const
  },
})
expectType<true>(CSError.prop)
