import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { Info, Plugin } from '../main.js'

const name = 'test' as const
const emptyPlugin = { name }
const barePlugin = {
  ...emptyPlugin,
  instanceMethods: {
    instanceMethod: (info: Info['instanceMethods'], arg: '') => arg,
  },
}
const fullPlugin = {
  ...barePlugin,
  getOptions: (input: true) => input,
}

const BareAnyError = modernErrors([barePlugin])
const FullAnyError = modernErrors([fullPlugin])
const MixAnyError = modernErrors([emptyPlugin, fullPlugin] as const)
const BareChildError = BareAnyError.subclass('BareChildError')
const FullChildError = FullAnyError.subclass('FullChildError')
const MixChildError = MixAnyError.subclass('MixChildError')
const bareUnknownError = new BareAnyError('', { cause: '' })
const fullUnknownError = new FullAnyError('', { cause: '' })
const mixUnknownError = new MixAnyError('', { cause: '' })
const bareChildError = new BareChildError('')
const fullChildError = new FullChildError('')
const mixChildError = new MixChildError('')

expectType<''>(bareUnknownError.instanceMethod(''))
expectType<''>(bareChildError.instanceMethod(''))
expectType<''>(fullUnknownError.instanceMethod(''))
expectType<''>(fullChildError.instanceMethod(''))
expectType<''>(mixUnknownError.instanceMethod(''))
expectType<''>(mixChildError.instanceMethod(''))
expectError(bareUnknownError.instanceMethod(true))
expectError(bareChildError.instanceMethod(true))
expectError(fullUnknownError.instanceMethod(true))
expectError(fullChildError.instanceMethod(true))
expectError(mixUnknownError.instanceMethod(true))
expectError(mixChildError.instanceMethod(true))

expectType<''>(fullUnknownError.instanceMethod('', true))
expectType<''>(fullChildError.instanceMethod('', true))
expectType<''>(mixUnknownError.instanceMethod('', true))
expectType<''>(mixChildError.instanceMethod('', true))
expectError(bareUnknownError.instanceMethod('', true))
expectError(bareChildError.instanceMethod('', true))
expectError(bareUnknownError.instanceMethod('', undefined))
expectError(bareChildError.instanceMethod('', undefined))
expectError(fullUnknownError.instanceMethod('', false))
expectError(fullChildError.instanceMethod('', false))
expectError(fullUnknownError.instanceMethod('', undefined))
expectError(fullChildError.instanceMethod('', undefined))
expectError(fullUnknownError.instanceMethod('', true, undefined))
expectError(fullChildError.instanceMethod('', true, undefined))
expectError(mixUnknownError.instanceMethod('', false))
expectError(mixChildError.instanceMethod('', false))
expectError(mixUnknownError.instanceMethod('', undefined))
expectError(mixChildError.instanceMethod('', undefined))
expectError(mixUnknownError.instanceMethod('', true, undefined))
expectError(mixChildError.instanceMethod('', true, undefined))

const info = {} as Info['instanceMethods']
expectError(bareUnknownError.instanceMethod(info))
expectError(bareChildError.instanceMethod(info))
expectError(fullUnknownError.instanceMethod(info, ''))
expectError(fullChildError.instanceMethod(info, ''))
expectError(mixUnknownError.instanceMethod(info, ''))
expectError(mixChildError.instanceMethod(info, ''))

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')
const unknownWideError = new WideAnyError('', { cause: '' })
const childWideError = new ChildWideError('')

expectError(bareUnknownError.otherMethod())
expectError(bareChildError.otherMethod())
expectError(fullUnknownError.otherMethod())
expectError(fullChildError.otherMethod())
expectError(mixUnknownError.otherMethod())
expectError(mixChildError.otherMethod())
expectError(unknownWideError.otherMethod())
expectError(childWideError.otherMethod())

const exception = {} as unknown
if (exception instanceof BareChildError) {
  expectType<''>(exception.instanceMethod(''))
}
if (exception instanceof FullChildError) {
  expectType<''>(exception.instanceMethod(''))
}
if (exception instanceof MixChildError) {
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
