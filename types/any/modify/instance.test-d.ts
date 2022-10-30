import { expectType, expectAssignable } from 'tsd'

import modernErrors, { ErrorInstance } from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {
    prop = true
  },
})
const SCError = CError.subclass('SCError')
const CSError = SError.subclass('CSError', {
  custom: class extends SError {
    prop = true
  },
})
const CCError = CError.subclass('CCError', {
  custom: class extends CError {
    propTwo = true
  },
})

const wideError = {} as any as AnyInstance
const sError = new SError('')
const ssError = new SSError('')
const cError = new CError('')
const scError = new SCError('')
const csError = new CSError('')
const ccError = new CCError('')

expectType<Error>(wideError)
expectType<Error>(sError)
expectType<Error>(ssError)
expectAssignable<Error>(cError)
expectAssignable<Error>(scError)
expectAssignable<Error>(csError)
expectAssignable<Error>(ccError)

expectType<ErrorInstance>(wideError)
expectType<ErrorInstance>(sError)
expectType<ErrorInstance>(ssError)
expectAssignable<ErrorInstance>(cError)
expectAssignable<ErrorInstance>(scError)
expectAssignable<ErrorInstance>(csError)
expectAssignable<ErrorInstance>(ccError)

expectType<AnyInstance>(wideError)
expectType<AnyInstance>(sError)
expectType<AnyInstance>(ssError)
expectAssignable<AnyInstance>(cError)
expectAssignable<AnyInstance>(scError)
expectAssignable<AnyInstance>(csError)
expectAssignable<AnyInstance>(ccError)

expectType<typeof AnyError['prototype']>(wideError)
expectType<typeof SError['prototype']>(sError)
expectType<typeof SSError['prototype']>(ssError)
expectType<typeof CError['prototype']>(cError)
expectType<typeof SCError['prototype']>(scError)
expectType<typeof CSError['prototype']>(csError)
expectType<typeof CCError['prototype']>(ccError)

expectType<Error>({} as ErrorInstance)
