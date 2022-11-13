import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from 'modern-errors'

const BaseError = modernErrors()
const ChildError = BaseError.subclass('ChildError')

const name = 'test' as const

expectType<true>(
  new ChildError('', {
    cause: new ChildError('', { props: { prop: true as const } }),
  }).prop,
)

const MessageFuncError = modernErrors({
  plugins: [{ name, instanceMethods: { message: () => {} } }],
})
expectType<Error['message']>(new MessageFuncError('', { cause: '' }).message)

const MessagePropertyError = modernErrors({
  plugins: [{ name, properties: () => ({ message: 'test' as const }) }],
})
expectType<string>(new MessagePropertyError('', { cause: '' }).message)
expectType<string>(
  new ChildError('', { props: { message: 'test' as const } }).message,
)
expectType<string>(new ChildError('', { props: { message: true } }).message)

const StackPropertyError = modernErrors({
  plugins: [{ name, properties: () => ({ stack: 'test' as const }) }],
})
expectType<string | undefined>(new StackPropertyError('', { cause: '' }).stack)
expectType<string | undefined>(
  new ChildError('', { props: { stack: 'test' as const } }).stack,
)
expectType<string | undefined>(
  new ChildError('', { props: { stack: true } }).stack,
)

const NamePropertyError = modernErrors({
  plugins: [{ name, properties: () => ({ name: 'test' }) }],
})
const ThreeError = NamePropertyError.subclass('ThreeError')
expectType<string>(new ThreeError('').name)
expectType<string>(new ChildError('', { props: { name: 'test' } }).name)

const CausePropertyError = modernErrors({
  plugins: [{ name, properties: () => ({ cause: '' }) }],
})
const FourError = CausePropertyError.subclass('FourError')
expectType<Error['cause']>(new FourError('').cause)
expectType<Error['cause']>(new ChildError('', { props: { cause: '' } }).cause)

const AggregatePropertyError = modernErrors({
  plugins: [{ name, properties: () => ({ errors: [''] }) }],
})
expectError(new AggregatePropertyError('', { cause: '' }).errors)
expectError(new ChildError('', { props: { errors: [''] } }).errors)

const InstanceMethodPropertyError = modernErrors({
  plugins: [
    {
      name,
      properties: () => ({ prop: 'test' as const }),
      instanceMethods: { prop: () => {} },
    },
  ],
})
expectAssignable<Function>(
  new InstanceMethodPropertyError('', { cause: '' }).prop,
)

const InstanceMethodError = modernErrors({
  plugins: [{ name, instanceMethods: { prop: () => {} } }],
})
expectAssignable<Function>(
  new InstanceMethodError('', { cause: '', props: { prop: '' } }).prop,
)
expectAssignable<Function>(
  new ChildError('', { cause: new InstanceMethodError('') }).prop,
)

const PropertyError = modernErrors({
  plugins: [{ name, properties: () => ({ prop: 'test' as const }) }],
})
expectType<'test'>(
  new PropertyError('', { cause: '', props: { prop: 'test' as const } }).prop,
)
expectType<'test'>(
  new PropertyError('', { cause: '', props: { prop: '' as const } }).prop,
)
expectType<'test'>(new ChildError('', { cause: new PropertyError('') }).prop)

const ConflictPropertyError = modernErrors({
  plugins: [
    { name: 'one' as const, properties: () => ({ prop: 'one' as const }) },
    { name: 'two' as const, properties: () => ({ prop: 'two' as const }) },
  ],
})
expectType<undefined>(new ConflictPropertyError('', { cause: '' }).prop)
