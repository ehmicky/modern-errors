import { expectType, expectError } from 'tsd'

import modernErrors, { Info, Plugin } from '../main.js'

const plugin = {
  name: 'test' as const,
  getOptions: (input: true) => input,
  staticMethods: {
    staticMethod: (_: Info['staticMethods'], arg: '') => arg,
  },
}

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')

expectType<''>(PAnyError.staticMethod(''))
expectError(expectType<''>(PAnyError.staticMethod(true)))

expectType<''>(PAnyError.staticMethod('', true))
expectError(expectType<''>(PAnyError.staticMethod('', false)))

const info = {} as Info['staticMethods']
expectError(expectType<''>(PAnyError.staticMethod(info, '')))

const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')

expectError(PAnyError.otherMethod())
expectError(GPAnyError.otherMethod())
expectError(PSError.otherMethod())
expectError(GPSError.otherMethod())

expectError(PSError.staticMethod())
expectError(GPSError.staticMethod())
