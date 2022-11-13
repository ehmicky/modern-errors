import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import ModernError, { Info, Plugin } from 'modern-errors'

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

const BareBaseError = ModernError.subclass('BareBaseError', {
  plugins: [barePlugin],
})
const FullBaseError = ModernError.subclass('FullBaseError', {
  plugins: [fullPlugin],
})
const MixBaseError = ModernError.subclass('MixBaseError', {
  plugins: [emptyPlugin, fullPlugin] as const,
})
const BareChildError = BareBaseError.subclass('BareChildError')
const FullChildError = FullBaseError.subclass('FullChildError')
const MixChildError = MixBaseError.subclass('MixChildError')
const bareUnknownError = new BareBaseError('')
const fullUnknownError = new FullBaseError('')
const mixUnknownError = new MixBaseError('')
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

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})
const ChildWideError = WideBaseError.subclass('ChildWideError')
const unknownWideError = new WideBaseError('')
const childWideError = new ChildWideError('')

expectError(bareUnknownError.otherMethod())
expectError(bareChildError.otherMethod())
expectError(fullUnknownError.otherMethod())
expectError(fullChildError.otherMethod())
expectError(mixUnknownError.otherMethod())
expectError(mixChildError.otherMethod())
expectError(unknownWideError.otherMethod())
expectError(childWideError.otherMethod())

// TODO: fix
// const exception = {} as unknown
// if (exception instanceof BareChildError) {
//   expectType<''>(exception.instanceMethod(''))
// }
// if (exception instanceof FullChildError) {
//   expectType<''>(exception.instanceMethod(''))
// }
// if (exception instanceof MixChildError) {
//   expectType<''>(exception.instanceMethod(''))
// }

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
expectNotAssignable<Plugin>({
  name,
  instanceMethods: { instanceMethod: (info: { one: '' }) => '' },
})
