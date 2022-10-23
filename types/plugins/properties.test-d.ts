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
  properties: (info: Info['properties']) => ({ property: true } as const),
}

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
const paError = new PAnyError('', { cause: '' })
const psError = new PSError('')

expectType<true>(paError.property)
expectType<true>(psError.property)

const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')
const gpaError = new GPAnyError('', { cause: '' })
const gpsError = new GPSError('')

expectError(paError.otherProperty)
expectError(psError.otherProperty)
expectError(gpaError.otherProperty)
expectError(gpsError.otherProperty)

const exception = {} as unknown
if (exception instanceof PSError) {
  expectType<true>(exception.property)
}

expectAssignable<Plugin>(plugin)
expectNotAssignable<Plugin>({ name, properties: true })
expectNotAssignable<Plugin>({ name, properties: (info: true) => ({}) })
expectNotAssignable<Plugin>({
  name,
  properties: (info: Info['properties'], arg: true) => ({}),
})
expectNotAssignable<Plugin>({
  name,
  properties: (info: Info['properties']) => true,
})
expectNotAssignable<Plugin>({
  name,
  properties: (info: Info['properties']) => [],
})
