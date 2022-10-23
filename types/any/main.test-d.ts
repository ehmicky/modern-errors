import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, AnyErrorClass } from '../main.js'

const barePlugin = { name: 'test' as const }
const plugin = { ...barePlugin, staticMethods: { staticMethod() {} } }

type BAnyErrorClass = AnyErrorClass<[typeof barePlugin]>
type PAnyErrorClass = AnyErrorClass<[typeof plugin]>

const PAnyError = modernErrors([plugin])

expectAssignable<AnyErrorClass>(PAnyError)
expectAssignable<BAnyErrorClass>(PAnyError)
expectAssignable<PAnyErrorClass>(PAnyError)

const PSError = PAnyError.subclass('PSError')

expectNotAssignable<AnyErrorClass>(PSError)
expectNotAssignable<BAnyErrorClass>(PSError)
expectNotAssignable<PAnyErrorClass>(PSError)

const GPAnyError = modernErrors([{} as Plugin])

expectAssignable<AnyErrorClass>(GPAnyError)
expectAssignable<BAnyErrorClass>(GPAnyError)
expectNotAssignable<PAnyErrorClass>(GPAnyError)

const GPSError = GPAnyError.subclass('GPSError')

expectNotAssignable<AnyErrorClass>(GPSError)
expectNotAssignable<BAnyErrorClass>(GPSError)
expectNotAssignable<PAnyErrorClass>(GPSError)
