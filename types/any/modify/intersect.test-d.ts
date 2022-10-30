import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from '../../main.js'

const AnyError = modernErrors()
const ChildError = AnyError.subclass('ChildError')

const name = 'test' as const

expectError(
  new ChildError('', { cause: new ChildError('', { props: { prop: true } }) })
    .prop,
)

const MessageFuncError = modernErrors([
  { name, instanceMethods: { message: () => {} } },
])
expectType<Error['message']>(new MessageFuncError('', { cause: '' }).message)

const MessagePropertyError = modernErrors([
  { name, properties: () => ({ message: 'test' as const }) },
])
expectType<string>(new MessagePropertyError('', { cause: '' }).message)
expectType<string>(
  new ChildError('', { props: { message: 'test' as const } }).message,
)
expectType<string>(new ChildError('', { props: { message: true } }).message)

const StackPropertyError = modernErrors([
  { name, properties: () => ({ stack: 'test' as const }) },
])
expectType<string | undefined>(new StackPropertyError('', { cause: '' }).stack)
expectType<string | undefined>(
  new ChildError('', { props: { stack: 'test' as const } }).stack,
)
expectType<string | undefined>(
  new ChildError('', { props: { stack: true } }).stack,
)

const NamePropertyError = modernErrors([
  { name, properties: () => ({ name: 'test' }) },
])
const ThreeError = NamePropertyError.subclass('ThreeError')
expectType<string>(new ThreeError('').name)
expectType<string>(new ChildError('', { props: { name: 'test' } }).name)

const CausePropertyError = modernErrors([
  { name, properties: () => ({ cause: '' }) },
])
const FourError = CausePropertyError.subclass('FourError')
expectType<Error['cause']>(new FourError('').cause)
expectType<Error['cause']>(new ChildError('', { props: { cause: '' } }).cause)

const AggregatePropertyError = modernErrors([
  { name, properties: () => ({ errors: [''] }) },
])
expectError(new AggregatePropertyError('', { cause: '' }).errors)
expectError(new ChildError('', { props: { errors: [''] } }).errors)

const InstanceMethodPropertyError = modernErrors([
  {
    name,
    properties: () => ({ prop: 'test' as const }),
    instanceMethods: { prop: () => {} },
  },
])
expectAssignable<Function>(
  new InstanceMethodPropertyError('', { cause: '' }).prop,
)

const InstanceMethodError = modernErrors([
  { name, instanceMethods: { prop: () => {} } },
])
expectAssignable<Function>(
  new InstanceMethodError('', { cause: '', props: { prop: '' } }).prop,
)
expectError(new ChildError('', { cause: new InstanceMethodError('') }).prop)

const PropertyError = modernErrors([
  { name, properties: () => ({ prop: 'test' as const }) },
])
expectType<'test'>(
  new PropertyError('', { cause: '', props: { prop: 'test' as const } }).prop,
)
expectType<never>(
  new PropertyError('', { cause: '', props: { prop: '' as const } }),
)
expectError(new ChildError('', { cause: new PropertyError('') }).prop)

const ConflictPropertyError = modernErrors([
  { name: 'one' as const, properties: () => ({ prop: 'one' as const }) },
  { name: 'two' as const, properties: () => ({ prop: 'two' as const }) },
])
expectType<undefined>(new ConflictPropertyError('', { cause: '' }).prop)
