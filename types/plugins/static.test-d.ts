import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { Info, Plugin } from '../main.js'

const name = 'test' as const
const plugin = {
  name,
  getOptions: (input: true) => input,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], arg: '') => arg,
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

expectAssignable<Plugin>({
  name,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], one: '', two: '') => '',
  },
})
expectAssignable<Plugin>({ name, staticMethods: {} })
expectNotAssignable<Plugin>({ name, staticMethods: true })
expectNotAssignable<Plugin>({ name, staticMethods: { staticMethod: true } })
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: true) => '' },
})
