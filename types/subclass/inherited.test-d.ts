import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'

const AnyError = modernErrors()

const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {
    static prop = true as const
  },
})
const SCError = CError.subclass('SCError')
const CCError = CError.subclass('CCError', {
  custom: class extends CError {
    static deepProp = true as const
  },
})
const CSError = SError.subclass('CSError', {
  custom: class extends SError {
    static prop = true as const
  },
})

expectType<true>(CError.prop)
expectType<true>(SCError.prop)
expectType<true>(CCError.prop)
expectType<true>(CCError.deepProp)
expectType<true>(CSError.prop)

expectError(SError.normalize(''))
expectError(SSError.normalize(''))
