import { expectType, expectAssignable, expectError } from 'tsd'

import ModernError from 'modern-errors'

const name = 'test' as const

expectType<true>(
  new ModernError('', {
    cause: new ModernError('', { props: { prop: true as const } }),
  }).prop,
)

const MessageFuncError = ModernError.subclass('MessageFuncError', {
  plugins: [{ name, instanceMethods: { message: () => {} } }],
})
expectType<Error['message']>(new MessageFuncError('').message)

const MessagePropertyError = ModernError.subclass('MessagePropertyError', {
  plugins: [{ name, properties: () => ({ message: 'test' as const }) }],
})
expectType<string>(new MessagePropertyError('').message)
expectType<string>(
  new ModernError('', { props: { message: 'test' as const } }).message,
)
expectType<string>(new ModernError('', { props: { message: true } }).message)

const StackPropertyError = ModernError.subclass('StackPropertyError', {
  plugins: [{ name, properties: () => ({ stack: 'test' as const }) }],
})
expectType<string | undefined>(new StackPropertyError('').stack)
expectType<string | undefined>(
  new ModernError('', { props: { stack: 'test' as const } }).stack,
)
expectType<string | undefined>(
  new ModernError('', { props: { stack: true } }).stack,
)

const NamePropertyError = ModernError.subclass('NamePropertyError', {
  plugins: [{ name, properties: () => ({ name: 'test' }) }],
})
const ThreeError = NamePropertyError.subclass('ThreeError')
expectType<string>(new ThreeError('').name)
expectType<string>(new ModernError('', { props: { name: 'test' } }).name)

const CausePropertyError = ModernError.subclass('CausePropertyError', {
  plugins: [{ name, properties: () => ({ cause: '' }) }],
})
const FourError = CausePropertyError.subclass('FourError')
expectType<Error['cause']>(new FourError('').cause)
expectType<Error['cause']>(new ModernError('', { props: { cause: '' } }).cause)

const AggregatePropertyError = ModernError.subclass('AggregatePropertyError', {
  plugins: [{ name, properties: () => ({ errors: [''] }) }],
})
expectType<string[]>(new AggregatePropertyError('').errors)
expectType<boolean[]>(new ModernError('', { props: { errors: [true] } }).errors)
expectType<Error[]>(
  new ModernError('', { props: { errors: [true] }, errors: [true] }).errors,
)

const InstanceMethodPropertyError = ModernError.subclass(
  'InstanceMethodPropertyError',
  {
    plugins: [
      {
        name,
        properties: () => ({ prop: 'test' as const }),
        instanceMethods: { prop: () => {} },
      },
    ],
  },
)
expectAssignable<Function>(new InstanceMethodPropertyError('').prop)

const InstanceMethodError = ModernError.subclass('InstanceMethodError', {
  plugins: [{ name, instanceMethods: { prop: () => {} } }],
})
expectAssignable<Function>(
  new InstanceMethodError('', { props: { prop: '' } }).prop,
)
expectAssignable<Function>(
  new ModernError('', { cause: new InstanceMethodError('') }).prop,
)

const PropertyError = ModernError.subclass('PropertyError', {
  plugins: [{ name, properties: () => ({ prop: 'test' as const }) }],
})
expectType<'test'>(
  new PropertyError('', { props: { prop: 'test' as const } }).prop,
)
expectType<'test'>(new PropertyError('', { props: { prop: '' as const } }).prop)
expectType<'test'>(new ModernError('', { cause: new PropertyError('') }).prop)

const ConflictPropertyError = ModernError.subclass('ConflictPropertyError', {
  plugins: [
    { name: 'one' as const, properties: () => ({ prop: 'one' as const }) },
    { name: 'two' as const, properties: () => ({ prop: 'two' as const }) },
  ],
})
expectType<undefined>(new ConflictPropertyError('').prop)
