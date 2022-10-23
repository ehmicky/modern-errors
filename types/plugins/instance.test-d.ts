import { expectType, expectError } from 'tsd'

import modernErrors, { Info, Plugin } from '../main.js'

const plugin = {
  name: 'test' as const,
  getOptions: (input: true) => input,
  instanceMethods: {
    instanceMethod: (_: Info['instanceMethods'], arg: '') => arg,
  },
}

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
const paError = new PAnyError('', { cause: '' })
const psError = new PSError('')

expectType<''>(paError.instanceMethod(''))
expectType<''>(psError.instanceMethod(''))
expectError(paError.instanceMethod(true))
expectError(psError.instanceMethod(true))

expectType<''>(paError.instanceMethod('', true))
expectType<''>(psError.instanceMethod('', true))
expectError(paError.instanceMethod('', false))
expectError(psError.instanceMethod('', false))

const info = {} as Info['instanceMethods']
expectError(paError.instanceMethod(info, ''))
expectError(psError.instanceMethod(info, ''))

const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')
const gpaError = new GPAnyError('', { cause: '' })
const gpsError = new GPSError('')

expectError(paError.otherMethod())
expectError(psError.otherMethod())
expectError(gpaError.otherMethod())
expectError(gpsError.otherMethod())

const exception = {} as unknown
if (exception instanceof PSError) {
  expectType<''>(exception.instanceMethod(''))
}
