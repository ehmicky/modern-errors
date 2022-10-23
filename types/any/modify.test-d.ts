import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorInstance } from '../main.js'

const barePlugin = { name: 'test' as const }
const plugin = { ...barePlugin, instanceMethods: { instanceMethod() {} } }

type BErrorInstance = ErrorInstance<[typeof barePlugin]>
type PErrorInstance = ErrorInstance<[typeof plugin]>

const PAnyError = modernErrors([plugin])
const paError = new PAnyError('', { cause: '' })

expectAssignable<Error>(paError)
expectAssignable<ErrorInstance>(paError)
expectAssignable<BErrorInstance>(paError)
expectAssignable<PErrorInstance>(paError)
expectType<'UnknownError'>(paError.name)

const PSError = PAnyError.subclass('PSError')
const psError = new PSError('')

expectAssignable<Error>(psError)
expectAssignable<ErrorInstance>(psError)
expectAssignable<BErrorInstance>(psError)
expectAssignable<PErrorInstance>(psError)
expectType<'PSError'>(psError.name)

const GPAnyError = modernErrors([{} as Plugin])
const gpaError = new GPAnyError('', { cause: '' })
type GPAErrorInstance = InstanceType<typeof GPAnyError>

expectAssignable<Error>(gpaError)
expectAssignable<ErrorInstance>(gpaError)
expectAssignable<BErrorInstance>(gpaError)
expectNotAssignable<PErrorInstance>(gpaError)
expectAssignable<GPAErrorInstance>(gpaError)
expectType<'UnknownError'>(gpaError.name)

const exception = {} as unknown
if (exception instanceof GPAnyError) {
  expectAssignable<GPAErrorInstance>(exception)
}

const GPSError = GPAnyError.subclass('GPSError')
const gpsError = new GPSError('')
type GPSErrorInstance = InstanceType<typeof GPSError>

expectAssignable<Error>(gpsError)
expectAssignable<ErrorInstance>(gpsError)
expectAssignable<BErrorInstance>(gpsError)
expectNotAssignable<PErrorInstance>(gpsError)
expectAssignable<GPAErrorInstance>(gpsError)
expectAssignable<GPSErrorInstance>(gpsError)
expectType<'GPSError'>(gpsError.name)

if (exception instanceof GPSError) {
  expectAssignable<GPSErrorInstance>(exception)
}
