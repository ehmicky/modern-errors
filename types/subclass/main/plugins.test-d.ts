import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorClass } from '../../main.js'

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
