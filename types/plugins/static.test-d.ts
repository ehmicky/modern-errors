import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { Info, Plugin } from 'modern-errors'

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

const BareAnyError = modernErrors([barePlugin])
const FullAnyError = modernErrors([fullPlugin])
const MixAnyError = modernErrors([emptyPlugin, fullPlugin] as const)
const BareChildError = BareAnyError.subclass('BareChildError')
const FullChildError = FullAnyError.subclass('FullChildError')
const MixChildError = MixAnyError.subclass('MixChildError')

expectType<''>(BareAnyError.staticMethod(''))
expectType<''>(FullAnyError.staticMethod(''))
expectType<''>(MixAnyError.staticMethod(''))
expectError(expectType<''>(BareAnyError.staticMethod(true)))
expectError(expectType<''>(FullAnyError.staticMethod(true)))
expectError(expectType<''>(MixAnyError.staticMethod(true)))

expectType<''>(FullAnyError.staticMethod('', true))
expectError(BareAnyError.staticMethod('', true))
expectError(BareAnyError.staticMethod('', undefined))
expectError(FullAnyError.staticMethod('', false))
expectError(FullAnyError.staticMethod('', undefined))
expectError(FullAnyError.staticMethod('', true, undefined))
expectError(MixAnyError.staticMethod('', false))
expectError(MixAnyError.staticMethod('', undefined))
expectError(MixAnyError.staticMethod('', true, undefined))

const info = {} as Info['staticMethods']
expectError(BareAnyError.staticMethod(info))
expectError(FullAnyError.staticMethod(info, ''))
expectError(MixAnyError.staticMethod(info, ''))

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')

expectError(BareAnyError.otherMethod())
expectError(FullAnyError.otherMethod())
expectError(MixAnyError.otherMethod())
expectError(WideAnyError.otherMethod())
expectError(BareChildError.otherMethod())
expectError(FullChildError.otherMethod())
expectError(MixChildError.otherMethod())
expectError(ChildWideError.otherMethod())

expectError(BareChildError.staticMethod())
expectError(FullChildError.staticMethod())
expectError(MixChildError.staticMethod())
expectError(ChildWideError.staticMethod())

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
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: { one: '' }) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: Info['properties']) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: Info['instanceMethods']) => '' },
})
