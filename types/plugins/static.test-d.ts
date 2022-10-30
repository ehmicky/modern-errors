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

const AnyError = modernErrors([plugin])
const ChildError = AnyError.subclass('ChildError')

expectType<''>(AnyError.staticMethod(''))
expectError(expectType<''>(AnyError.staticMethod(true)))

expectType<''>(AnyError.staticMethod('', true))
expectError(expectType<''>(AnyError.staticMethod('', false)))

const info = {} as Info['staticMethods']
expectError(expectType<''>(AnyError.staticMethod(info, '')))

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')

expectError(AnyError.otherMethod())
expectError(WideAnyError.otherMethod())
expectError(ChildError.otherMethod())
expectError(ChildWideError.otherMethod())

expectError(ChildError.staticMethod())
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
