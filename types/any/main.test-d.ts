import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, AnyErrorClass } from '../main.js'

const plugin = {
  name: 'test' as const,
  staticMethods: { staticMethod: () => '' },
}

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
type PAnyErrorClass = AnyErrorClass<[typeof plugin]>

expectAssignable<AnyErrorClass>(PAnyError)
expectAssignable<PAnyErrorClass>(PAnyError)
expectNotAssignable<AnyErrorClass>(PSError)
expectNotAssignable<PAnyErrorClass>(PSError)

const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')

expectAssignable<AnyErrorClass>(GPAnyError)
expectNotAssignable<PAnyErrorClass>(GPAnyError)
expectNotAssignable<AnyErrorClass>(GPSError)
expectNotAssignable<PAnyErrorClass>(GPSError)
