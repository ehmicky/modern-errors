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
  instanceMethods: {
    instanceMethod: (info: Info['instanceMethods'], arg: '') => arg,
  },
}

const AnyError = modernErrors([plugin])
const ChildError = AnyError.subclass('ChildError')
const unknownError = new AnyError('', { cause: '' })
const childError = new ChildError('')

expectType<''>(unknownError.instanceMethod(''))
expectType<''>(childError.instanceMethod(''))
expectError(unknownError.instanceMethod(true))
expectError(childError.instanceMethod(true))

expectType<''>(unknownError.instanceMethod('', true))
expectType<''>(childError.instanceMethod('', true))
expectError(unknownError.instanceMethod('', false))
expectError(childError.instanceMethod('', false))

const info = {} as Info['instanceMethods']
expectError(unknownError.instanceMethod(info, ''))
expectError(childError.instanceMethod(info, ''))

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')
const unknownWideError = new WideAnyError('', { cause: '' })
const childWideError = new ChildWideError('')

expectError(unknownError.otherMethod())
expectError(childError.otherMethod())
expectError(unknownWideError.otherMethod())
expectError(childWideError.otherMethod())

const exception = {} as unknown
if (exception instanceof ChildError) {
  expectType<''>(exception.instanceMethod(''))
}

expectAssignable<Plugin>({
  name,
  instanceMethods: {
    instanceMethod: (info: Info['instanceMethods'], one: '', two: '') => '',
  },
})
expectAssignable<Plugin>({ name, instanceMethods: {} })
expectNotAssignable<Plugin>({ name, instanceMethods: true })
expectNotAssignable<Plugin>({ name, instanceMethods: { instanceMethod: true } })
expectNotAssignable<Plugin>({
  name,
  instanceMethods: { instanceMethod: (info: true) => '' },
})
