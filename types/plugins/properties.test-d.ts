import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { Info, Plugin } from '../main.js'

const name = 'test' as const
const emptyPlugin = { name }
const fullPlugin = {
  ...emptyPlugin,
  properties: (info: Info['properties']) => ({ property: true } as const),
}

const AnyError = modernErrors([fullPlugin])
const MixAnyError = modernErrors([emptyPlugin, fullPlugin] as const)
const ChildError = AnyError.subclass('ChildError')
const MixChildError = MixAnyError.subclass('MixChildError')
const unknownError = new AnyError('', { cause: '' })
const childError = new ChildError('')
const mixUnknownError = new MixAnyError('', { cause: '' })
const mixChildError = new MixChildError('')

expectType<true>(unknownError.property)
expectType<true>(childError.property)
expectType<true>(mixUnknownError.property)
expectType<true>(mixChildError.property)

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')
const unknownWideError = new WideAnyError('', { cause: '' })
const childWideError = new ChildWideError('')

expectError(unknownError.otherProperty)
expectError(childError.otherProperty)
expectError(mixUnknownError.otherProperty)
expectError(mixChildError.otherProperty)
expectError(unknownWideError.otherProperty)
expectError(childWideError.otherProperty)

const exception = {} as unknown
if (exception instanceof ChildError) {
  expectType<true>(exception.property)
}
if (exception instanceof MixChildError) {
  expectType<true>(exception.property)
}

expectAssignable<Plugin>(fullPlugin)
expectNotAssignable<Plugin>({ name, properties: true })
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
