import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorClass } from '../main.js'

const plugin = {
  name: 'test' as const,
  properties: () => ({ property: true }),
}

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
type PErrorClass = ErrorClass<[typeof plugin]>

expectAssignable<ErrorClass>(PAnyError)
expectAssignable<PErrorClass>(PAnyError)
expectAssignable<ErrorClass>(PSError)
expectAssignable<PErrorClass>(PSError)

const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')

expectAssignable<ErrorClass>(GPAnyError)
expectNotAssignable<PErrorClass>(GPAnyError)
expectAssignable<ErrorClass>(GPSError)
expectNotAssignable<PErrorClass>(GPSError)
