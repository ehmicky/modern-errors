import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, {
  AnyErrorClass,
  ErrorClass,
  ErrorInstance,
} from '../../main.js'

const AnyError = modernErrors()
const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {},
})
const SCError = CError.subclass('SCError')
const CSError = SError.subclass('CSError', { custom: class extends SError {} })
const CCError = CError.subclass('CCError', { custom: class extends CError {} })

expectAssignable<ErrorClass>(AnyError)
expectAssignable<ErrorClass>(SError)
expectAssignable<ErrorClass>(SSError)
expectAssignable<ErrorClass>(CError)
expectAssignable<ErrorClass>(SCError)
expectAssignable<ErrorClass>(CSError)
expectAssignable<ErrorClass>(CCError)

expectAssignable<AnyErrorClass>(AnyError)
expectNotAssignable<AnyErrorClass>(SError)
expectNotAssignable<AnyErrorClass>(SSError)
expectNotAssignable<AnyErrorClass>(CError)
expectNotAssignable<AnyErrorClass>(SCError)
expectNotAssignable<AnyErrorClass>(CSError)
expectNotAssignable<AnyErrorClass>(CCError)

expectError(AnyError.subclass())
expectError(SError.subclass())
expectError(AnyError.subclass({}))
expectError(SError.subclass({}))
expectError(AnyError.subclass('Test'))
expectError(SError.subclass('Test'))

expectType<ErrorInstance>({} as InstanceType<ErrorClass>)
