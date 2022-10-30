import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, { Plugin, AnyErrorClass, ErrorClass } from '../main.js'

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

const barePlugin = { name: 'test' as const }
const plugin = { ...barePlugin, instanceMethods: { instanceMethod() {} } }

type BErrorClass = ErrorClass<[typeof barePlugin]>
type PErrorClass = ErrorClass<[typeof plugin]>

const PAnyError = modernErrors([plugin])

expectAssignable<ErrorClass>(PAnyError)
expectAssignable<BErrorClass>(PAnyError)
expectAssignable<PErrorClass>(PAnyError)

const PSError = PAnyError.subclass('PSError')

expectAssignable<ErrorClass>(PSError)
expectAssignable<BErrorClass>(PSError)
expectAssignable<PErrorClass>(PSError)

const GPAnyError = modernErrors([{} as Plugin])

expectAssignable<ErrorClass>(GPAnyError)
expectAssignable<BErrorClass>(GPAnyError)
expectNotAssignable<PErrorClass>(GPAnyError)

const GPSError = GPAnyError.subclass('GPSError')

expectAssignable<ErrorClass>(GPSError)
expectAssignable<BErrorClass>(GPSError)
expectNotAssignable<PErrorClass>(GPSError)

expectError(AnyError.subclass())
expectError(PAnyError.subclass())
expectError(SError.subclass())
expectError(AnyError.subclass({}))
expectError(PAnyError.subclass({}))
expectError(SError.subclass({}))
expectError(AnyError.subclass('Test'))
expectError(PAnyError.subclass('Test'))
expectError(SError.subclass('Test'))
