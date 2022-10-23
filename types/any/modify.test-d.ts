import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorInstance } from '../main.js'

const plugin = {
  name: 'test' as const,
  properties: () => ({ property: true }),
}

const PAnyError = modernErrors([plugin])
const paError = new PAnyError('', { cause: '' })
type PErrorInstance = ErrorInstance<[typeof plugin]>

expectAssignable<Error>(paError)
expectAssignable<ErrorInstance>(paError)
expectAssignable<PErrorInstance>(paError)

const PSError = PAnyError.subclass('PSError')
const psError = new PSError('')

expectAssignable<Error>(psError)
expectAssignable<ErrorInstance>(psError)
expectAssignable<PErrorInstance>(psError)

const GPAnyError = modernErrors([{} as Plugin])
const gpaError = new GPAnyError('', { cause: '' })

expectAssignable<Error>(gpaError)
expectAssignable<ErrorInstance>(gpaError)
expectNotAssignable<PErrorInstance>(gpaError)

const GPSError = GPAnyError.subclass('GPSError')
const gpsError = new GPSError('')

expectAssignable<Error>(gpsError)
expectAssignable<ErrorInstance>(gpsError)
expectNotAssignable<PErrorInstance>(gpsError)
