import ModernError, { type Plugin, type ErrorInstance } from 'modern-errors'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

type ModernErrorInstance = InstanceType<typeof ModernError>

const BaseError = ModernError.subclass('BaseError')
const ChildError = BaseError.subclass('ChildError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    one = true
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomChildError = BaseError.subclass('CustomChildError', {
  custom: class extends BaseError {
    one = true
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    two = true
  },
})

const generalError = {} as unknown as ModernErrorInstance
const childError = new BaseError('')
const deepChildError = new ChildError('')
const customError = new CustomError('')
const childCustomError = new ChildCustomError('')
const customChildError = new CustomChildError('')
const deepCustomError = new DeepCustomError('')

expectAssignable<Error>(generalError)
expectAssignable<Error>(childError)
expectAssignable<Error>(deepChildError)
expectAssignable<Error>(customError)
expectAssignable<Error>(childCustomError)
expectAssignable<Error>(customChildError)
expectAssignable<Error>(deepCustomError)

expectAssignable<ErrorInstance>(generalError)
expectAssignable<ErrorInstance>(childError)
expectAssignable<ErrorInstance>(deepChildError)
expectAssignable<ErrorInstance>(customError)
expectAssignable<ErrorInstance>(childCustomError)
expectAssignable<ErrorInstance>(customChildError)
expectAssignable<ErrorInstance>(deepCustomError)

expectType<ModernErrorInstance>(generalError)
expectType<ModernErrorInstance>(childError)
expectType<ModernErrorInstance>(deepChildError)
expectAssignable<ModernErrorInstance>(customError)
expectAssignable<ModernErrorInstance>(childCustomError)
expectAssignable<ModernErrorInstance>(customChildError)
expectAssignable<ModernErrorInstance>(deepCustomError)

expectType<(typeof ModernError)['prototype']>(generalError)
expectType<(typeof BaseError)['prototype']>(childError)
expectType<(typeof ChildError)['prototype']>(deepChildError)
expectType<(typeof CustomError)['prototype']>(customError)
expectType<(typeof ChildCustomError)['prototype']>(childCustomError)
expectType<(typeof CustomChildError)['prototype']>(customChildError)
expectType<(typeof DeepCustomError)['prototype']>(deepCustomError)

expectAssignable<Error>({} as ErrorInstance)

expectType<ModernErrorInstance>(
  new ModernError('', { cause: new ModernError('') }),
)
expectType<ModernErrorInstance>(new ModernError('', { cause: new Error('') }))
expectType<ModernErrorInstance>(new ModernError('', { cause: undefined }))
expectType<ModernErrorInstance>(new ModernError('', { cause: '' }))

const name = 'test' as const

expectType<true>(
  new ModernError('', {
    cause: new ModernError('', { props: { prop: true as const } }),
  }).prop,
)
expectType<false>(
  new ModernError('', {
    cause: new ModernError('', { props: { prop: true as const } }),
    props: { prop: false as const },
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
expectType<string>(new NamePropertyError('').name)
expectType<string>(new ModernError('', { props: { name: 'test' } }).name)

const CausePropertyError = ModernError.subclass('CausePropertyError', {
  plugins: [{ name, properties: () => ({ cause: '' }) }],
})
expectType<Error['cause']>(new CausePropertyError('').cause)
expectType<Error['cause']>(new ModernError('', { props: { cause: '' } }).cause)

const AggregatePropertyError = ModernError.subclass('AggregatePropertyError', {
  plugins: [{ name, properties: () => ({ errors: [''] }) }],
})
expectType<string[]>(new AggregatePropertyError('').errors)
expectType<boolean[]>(new ModernError('', { props: { errors: [true] } }).errors)
expectType<Error[]>(
  new ModernError('', { props: { errors: [true] }, errors: [true] }).errors,
)

const InstanceMethodPropError = ModernError.subclass(
  'InstanceMethodPropError',
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
expectAssignable<() => void>(new InstanceMethodPropError('').prop)

const InstanceMethodError = ModernError.subclass('InstanceMethodError', {
  plugins: [{ name, instanceMethods: { prop: () => {} } }],
})
expectAssignable<() => void>(
  new InstanceMethodError('', { props: { prop: '' } }).prop,
)
expectAssignable<() => void>(
  new ModernError('', { cause: new InstanceMethodError('') }).prop,
)
expectType<false>(
  new ModernError('', {
    cause: new InstanceMethodError(''),
    props: { prop: false as const },
  }).prop,
)

const PropertyError = ModernError.subclass('PropertyError', {
  plugins: [{ name, properties: () => ({ prop: true as const }) }],
})
expectType<true>(
  new PropertyError('', { props: { prop: false as const } }).prop,
)
expectType<true>(new ModernError('', { cause: new PropertyError('') }).prop)
expectType<false>(
  new ModernError('', {
    cause: new PropertyError(''),
    props: { prop: false as const },
  }).prop,
)

const ConflictPropertyError = ModernError.subclass('ConflictPropertyError', {
  plugins: [
    { name: 'one' as const, properties: () => ({ prop: 'one' as const }) },
    { name: 'two' as const, properties: () => ({ prop: 'two' as const }) },
  ],
})
expectType<undefined>(new ConflictPropertyError('').prop)

const barePlugin = { name: 'test' as const }
const fullPlugin = {
  ...barePlugin,
  instanceMethods: { instanceMethod: () => {} },
}

type BareErrorInstance = ErrorInstance<[typeof barePlugin]>

type FullErrorInstance = ErrorInstance<[typeof fullPlugin]>

const BasePluginError = ModernError.subclass('BaseError', {
  plugins: [fullPlugin],
})
const basePluginError = new BasePluginError('')

expectAssignable<Error>(basePluginError)
expectAssignable<ErrorInstance>(basePluginError)
expectAssignable<BareErrorInstance>(basePluginError)
expectAssignable<FullErrorInstance>(basePluginError)

const CustomPluginError = BasePluginError.subclass('CustomError', {
  custom: class extends BasePluginError {
    prop = true
  },
})
const customPluginError = new CustomPluginError('')

expectAssignable<Error>(customPluginError)
expectAssignable<ErrorInstance>(customPluginError)
expectAssignable<BareErrorInstance>(customPluginError)
expectAssignable<FullErrorInstance>(customPluginError)

const WidePluginError = ModernError.subclass('WideError', {
  plugins: [{} as Plugin],
})
const widePluginError = new WidePluginError('')
type WideErrorInstance = InstanceType<typeof WidePluginError>

expectAssignable<Error>(widePluginError)
expectAssignable<ErrorInstance>(widePluginError)
expectAssignable<BareErrorInstance>(widePluginError)
expectNotAssignable<FullErrorInstance>(widePluginError)
expectType<WideErrorInstance>(widePluginError)

const exception = {} as unknown

if (exception instanceof WidePluginError) {
  expectType<WideErrorInstance>(exception)
}

const CustomWideError = WidePluginError.subclass('CustomWideError', {
  custom: class extends WidePluginError {
    prop = true
  },
})
const customWideError = new CustomWideError('')
type CustomWideErrorInstance = InstanceType<typeof CustomWideError>

expectAssignable<Error>(customWideError)
expectAssignable<ErrorInstance>(customWideError)
expectAssignable<BareErrorInstance>(customWideError)
expectNotAssignable<FullErrorInstance>(customWideError)
expectAssignable<WideErrorInstance>(customWideError)
expectType<CustomWideErrorInstance>(customWideError)

if (exception instanceof CustomWideError) {
  expectType<CustomWideErrorInstance>(exception)
}
