import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { Info, Plugin } from '../main.js'

const name = 'test' as const
const barePlugin = {
  name,
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
const BareChildError = BareAnyError.subclass('BareChildError')
const FullChildError = FullAnyError.subclass('FullChildError')

expectType<''>(BareAnyError.staticMethod(''))
expectType<''>(FullAnyError.staticMethod(''))
expectError(expectType<''>(BareAnyError.staticMethod(true)))
expectError(expectType<''>(FullAnyError.staticMethod(true)))

expectType<''>(FullAnyError.staticMethod('', true))
expectError(BareAnyError.staticMethod('', true))
expectError(FullAnyError.staticMethod('', false))
expectError(FullAnyError.staticMethod('', true, undefined))

const info = {} as Info['staticMethods']
expectError(BareAnyError.staticMethod(info))
expectError(FullAnyError.staticMethod(info, ''))

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')

expectError(BareAnyError.otherMethod())
expectError(FullAnyError.otherMethod())
expectError(WideAnyError.otherMethod())
expectError(BareChildError.otherMethod())
expectError(FullChildError.otherMethod())
expectError(ChildWideError.otherMethod())

expectError(BareChildError.staticMethod())
expectError(FullChildError.staticMethod())
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
