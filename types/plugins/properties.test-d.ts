import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import ModernError, { Info, Plugin } from 'modern-errors'

const name = 'test' as const
const emptyPlugin = { name }
const fullPlugin = {
  ...emptyPlugin,
  properties: (info: Info['properties']) => ({ property: true } as const),
}

const BaseError = ModernError.subclass('BaseError', { plugins: [fullPlugin] })
const MixBaseError = ModernError.subclass('MixBaseError', {
  plugins: [emptyPlugin, fullPlugin] as const,
})
const ChildError = BaseError.subclass('ChildError')
const MixChildError = MixBaseError.subclass('MixChildError')
const unknownError = new BaseError('')
const childError = new ChildError('')
const mixUnknownError = new MixBaseError('')
const mixChildError = new MixChildError('')

expectType<true>(unknownError.property)
expectType<true>(childError.property)
expectType<true>(mixUnknownError.property)
expectType<true>(mixChildError.property)

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})
const ChildWideError = WideBaseError.subclass('ChildWideError')
const unknownWideError = new WideBaseError('')
const childWideError = new ChildWideError('')

expectError(unknownError.otherProperty)
expectError(childError.otherProperty)
expectError(mixUnknownError.otherProperty)
expectError(mixChildError.otherProperty)
expectError(unknownWideError.otherProperty)
expectError(childWideError.otherProperty)

// TODO: fix
// const exception = {} as unknown
// if (exception instanceof ChildError) {
//   expectType<true>(exception.property)
// }
// if (exception instanceof MixChildError) {
//   expectType<true>(exception.property)
// }

expectAssignable<Plugin>(fullPlugin)
expectNotAssignable<Plugin>({ name, properties: true })
expectNotAssignable<Plugin>({ name, properties: (info: true) => ({}) })
expectNotAssignable<Plugin>({ name, properties: (info: { one: '' }) => ({}) })
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
