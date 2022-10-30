import { expectType } from 'tsd'

import modernErrors from '../../main.js'

const AnyError = modernErrors()

const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {
    prop = true as const
  },
})
const SCError = CError.subclass('SCError')
const CCError = CError.subclass('CCError', {
  custom: class extends CError {
    deepProp = true as const
  },
})
const SError = AnyError.subclass('SError')
const CSError = SError.subclass('CSError', {
  custom: class extends SError {
    prop = true as const
  },
})

expectType<true>(new CError('').prop)
expectType<true>(new SCError('').prop)
expectType<true>(new CCError('').prop)
expectType<true>(new CCError('').deepProp)
expectType<true>(new CSError('').prop)
