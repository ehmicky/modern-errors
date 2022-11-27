import { expectType, expectError } from 'tsd'

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

expectType<''>(BareBaseError.instanceMethod(undefined, ''))
expectType<''>(FullBaseError.instanceMethod(undefined, ''))
expectType<''>(MixBaseError.instanceMethod(undefined, ''))
expectType<''>(BareChildError.instanceMethod(undefined, ''))
expectType<''>(FullChildError.instanceMethod(undefined, ''))
expectType<''>(MixChildError.instanceMethod(undefined, ''))

const error = new Error('test')

expectType<''>(BareBaseError.instanceMethod(error, ''))
expectType<''>(FullBaseError.instanceMethod(error, ''))
expectType<''>(MixBaseError.instanceMethod(error, ''))
expectType<''>(BareChildError.instanceMethod(error, ''))
expectType<''>(FullChildError.instanceMethod(error, ''))
expectType<''>(MixChildError.instanceMethod(error, ''))
expectError(BareBaseError.instanceMethod(error, true))
expectError(FullBaseError.instanceMethod(error, true))
expectError(MixBaseError.instanceMethod(error, true))
expectError(BareChildError.instanceMethod(error, true))
expectError(FullChildError.instanceMethod(error, true))
expectError(MixChildError.instanceMethod(error, true))

expectType<''>(FullBaseError.instanceMethod(error, '', true))
expectType<''>(FullChildError.instanceMethod(error, '', true))
expectError(BareBaseError.instanceMethod(error, '', true))
expectError(BareBaseError.instanceMethod(error, '', undefined))
expectError(FullBaseError.instanceMethod(error, '', false))
expectError(FullBaseError.instanceMethod(error, '', undefined))
expectError(FullBaseError.instanceMethod(error, '', true, undefined))
expectError(MixBaseError.instanceMethod(error, '', false))
expectError(MixBaseError.instanceMethod(error, '', undefined))
expectError(MixBaseError.instanceMethod(error, '', true, undefined))
expectError(BareChildError.instanceMethod(error, '', true))
expectError(BareChildError.instanceMethod(error, '', undefined))
expectError(FullChildError.instanceMethod(error, '', false))
expectError(FullChildError.instanceMethod(error, '', undefined))
expectError(FullChildError.instanceMethod(error, '', true, undefined))
expectError(MixChildError.instanceMethod(error, '', false))
expectError(MixChildError.instanceMethod(error, '', undefined))
expectError(MixChildError.instanceMethod(error, '', true, undefined))

const info = {} as Info['instanceMethods']
expectError(BareBaseError.instanceMethod(error, info))
expectError(FullBaseError.instanceMethod(error, info, ''))
expectError(MixBaseError.instanceMethod(error, info, ''))
expectError(BareChildError.instanceMethod(error, info))
expectError(FullChildError.instanceMethod(error, info, ''))
expectError(MixChildError.instanceMethod(error, info, ''))

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})
const ChildWideError = WideBaseError.subclass('ChildWideError')

expectError(BareBaseError.otherMethod())
expectError(FullBaseError.otherMethod())
expectError(MixBaseError.otherMethod())
expectError(WideBaseError.otherMethod())
expectError(BareChildError.otherMethod())
expectError(FullChildError.otherMethod())
expectError(MixChildError.otherMethod())
expectError(ChildWideError.otherMethod())

expectError(ChildWideError.instanceMethod(error, ''))
