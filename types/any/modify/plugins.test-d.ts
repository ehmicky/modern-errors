import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorInstance } from '../../main.js'

const barePlugin = { name: 'test' as const }
const plugin = { ...barePlugin, instanceMethods: { instanceMethod() {} } }

type BErrorInstance = ErrorInstance<[typeof barePlugin]>
type PErrorInstance = ErrorInstance<[typeof plugin]>

const PAnyError = modernErrors([plugin])
const paError = new PAnyError('', { cause: '' })

expectAssignable<Error>(paError)
expectAssignable<ErrorInstance>(paError)
expectAssignable<BErrorInstance>(paError)
expectType<PErrorInstance>(paError)

const PSError = PAnyError.subclass('PSError', {
  custom: class extends PAnyError {
    prop = true
  },
})
const psError = new PSError('')

expectAssignable<Error>(psError)
expectAssignable<ErrorInstance>(psError)
expectAssignable<BErrorInstance>(psError)
expectAssignable<PErrorInstance>(psError)

const GPAnyError = modernErrors([{} as Plugin])
const gpaError = new GPAnyError('', { cause: '' })
type GPAErrorInstance = InstanceType<typeof GPAnyError>

expectType<Error>(gpaError)
expectType<ErrorInstance>(gpaError)
expectType<BErrorInstance>(gpaError)
expectNotAssignable<PErrorInstance>(gpaError)
expectType<GPAErrorInstance>(gpaError)

const exception = {} as unknown
if (exception instanceof GPAnyError) {
  expectType<GPAErrorInstance>(exception)
}

const GPSError = GPAnyError.subclass('GPSError', {
  custom: class extends GPAnyError {
    prop = true
  },
})
const gpsError = new GPSError('')
type GPSErrorInstance = InstanceType<typeof GPSError>

expectAssignable<Error>(gpsError)
expectAssignable<ErrorInstance>(gpsError)
expectAssignable<BErrorInstance>(gpsError)
expectNotAssignable<PErrorInstance>(gpsError)
expectAssignable<GPAErrorInstance>(gpsError)
expectType<GPSErrorInstance>(gpsError)

if (exception instanceof GPSError) {
  expectType<GPSErrorInstance>(exception)
}
