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
  properties: (info: Info['properties']) => ({ property: true } as const),
}

const AnyError = modernErrors([plugin])
const ChildError = AnyError.subclass('ChildError')
const unknownError = new AnyError('', { cause: '' })
const childError = new ChildError('')

expectType<true>(unknownError.property)
expectType<true>(childError.property)

const WideAnyError = modernErrors([{} as Plugin])
const ChildWideError = WideAnyError.subclass('ChildWideError')
const unknownWideError = new WideAnyError('', { cause: '' })
const childWideError = new ChildWideError('')

expectError(unknownError.otherProperty)
expectError(childError.otherProperty)
expectError(unknownWideError.otherProperty)
expectError(childWideError.otherProperty)

const exception = {} as unknown
if (exception instanceof ChildError) {
  expectType<true>(exception.property)
}

expectAssignable<Plugin>(plugin)
expectNotAssignable<Plugin>({ name, properties: true })
expectNotAssignable<Plugin>({ name, properties: (info: true) => ({}) })
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
