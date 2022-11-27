import { expectType, expectError } from 'tsd'

import ModernError, { Info, Plugin } from 'modern-errors'

const name = 'test' as const
const emptyPlugin = { name }
const barePlugin = {
  ...emptyPlugin,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], arg: '') => arg,
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

expectType<''>(BareBaseError.staticMethod(''))
expectType<''>(FullBaseError.staticMethod(''))
expectType<''>(MixBaseError.staticMethod(''))
expectType<''>(BareChildError.staticMethod(''))
expectType<''>(FullChildError.staticMethod(''))
expectType<''>(MixChildError.staticMethod(''))
expectError(BareBaseError.staticMethod(true))
expectError(FullBaseError.staticMethod(true))
expectError(MixBaseError.staticMethod(true))
expectError(BareChildError.staticMethod(true))
expectError(FullChildError.staticMethod(true))
expectError(MixChildError.staticMethod(true))

expectType<''>(FullBaseError.staticMethod('', true))
expectType<''>(FullChildError.staticMethod('', true))
expectError(BareBaseError.staticMethod('', true))
expectError(BareBaseError.staticMethod('', undefined))
expectError(FullBaseError.staticMethod('', false))
expectError(FullBaseError.staticMethod('', undefined))
expectError(FullBaseError.staticMethod('', true, undefined))
expectError(MixBaseError.staticMethod('', false))
expectError(MixBaseError.staticMethod('', undefined))
expectError(MixBaseError.staticMethod('', true, undefined))
expectError(BareChildError.staticMethod('', true))
expectError(BareChildError.staticMethod('', undefined))
expectError(FullChildError.staticMethod('', false))
expectError(FullChildError.staticMethod('', undefined))
expectError(FullChildError.staticMethod('', true, undefined))
expectError(MixChildError.staticMethod('', false))
expectError(MixChildError.staticMethod('', undefined))
expectError(MixChildError.staticMethod('', true, undefined))

const info = {} as Info['staticMethods']
expectError(BareBaseError.staticMethod(info))
expectError(FullBaseError.staticMethod(info, ''))
expectError(MixBaseError.staticMethod(info, ''))
expectError(BareChildError.staticMethod(info))
expectError(FullChildError.staticMethod(info, ''))
expectError(MixChildError.staticMethod(info, ''))

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

expectError(ChildWideError.staticMethod(''))
