import { expectType } from 'tsd'

import modernErrors, { ErrorInstance } from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {},
})
const SCError = CError.subclass('SCError')
const CSError = SError.subclass('CSError', { custom: class extends SError {} })
const CCError = CError.subclass('CCError', { custom: class extends CError {} })

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
expectType<Error>(cError)
expectType<Error>(scError)
expectType<Error>(csError)
expectType<Error>(ccError)

expectType<ErrorInstance>(wideError)
expectType<ErrorInstance>(sError)
expectType<ErrorInstance>(ssError)
expectType<ErrorInstance>(cError)
expectType<ErrorInstance>(scError)
expectType<ErrorInstance>(csError)
expectType<ErrorInstance>(ccError)

expectType<AnyInstance>(wideError)
expectType<AnyInstance>(sError)
expectType<AnyInstance>(ssError)
expectType<AnyInstance>(cError)
expectType<AnyInstance>(scError)
expectType<AnyInstance>(csError)
expectType<AnyInstance>(ccError)

expectType<typeof AnyError['prototype']>(wideError)
expectType<typeof SError['prototype']>(sError)
expectType<typeof SSError['prototype']>(ssError)
expectType<typeof CError['prototype']>(cError)
expectType<typeof SCError['prototype']>(scError)
expectType<typeof CSError['prototype']>(csError)
expectType<typeof CCError['prototype']>(ccError)

expectType<Error>({} as ErrorInstance)
