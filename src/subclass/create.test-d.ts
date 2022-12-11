import ModernError, {
  type Plugin,
  type ErrorClass,
  type ErrorInstance,
} from 'modern-errors'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

const BaseError = ModernError.subclass('BaseError')
const ChildError = BaseError.subclass('ChildError')
const CustomError = ModernError.subclass('CustomError', {
  custom: class extends ModernError {
    prop = true
  },
})
const ChildCustomError = CustomError.subclass('ChildCustomError')
const CustomChildError = BaseError.subclass('CustomChildError', {
  custom: class extends BaseError {
    prop = true
  },
})
const DeepCustomError = CustomError.subclass('DeepCustomError', {
  custom: class extends CustomError {
    propTwo = true
  },
})

expectAssignable<ErrorClass>(ModernError)
expectAssignable<ErrorClass>(BaseError)
expectAssignable<ErrorClass>(ChildError)
expectAssignable<ErrorClass>(CustomError)
expectAssignable<ErrorClass>(ChildCustomError)
expectAssignable<ErrorClass>(CustomChildError)
expectAssignable<ErrorClass>(DeepCustomError)

// @ts-expect-error
ModernError.subclass()
// @ts-expect-error
ModernError.subclass({})
// @ts-expect-error
ModernError.subclass('Test')

expectAssignable<ErrorInstance>({} as InstanceType<ErrorClass>)

const barePlugin = { name: 'test' as const }
const fullPlugin = {
  ...barePlugin,
  instanceMethods: { instanceMethod: () => {} },
  staticMethods: { staticMethod: () => {} },
}

type BareErrorClass = ErrorClass<[typeof barePlugin]>

type FullErrorClass = ErrorClass<[typeof fullPlugin]>

const BasePluginError = ModernError.subclass('BaseError', {
  plugins: [fullPlugin],
})

expectAssignable<ErrorClass>(BasePluginError)
expectAssignable<BareErrorClass>(BasePluginError)
expectAssignable<FullErrorClass>(BasePluginError)

const ChildPluginError = BasePluginError.subclass('ChildError')

expectAssignable<ErrorClass>(ChildPluginError)
expectAssignable<BareErrorClass>(ChildPluginError)
expectAssignable<FullErrorClass>(ChildPluginError)

const CustomPluginError = BasePluginError.subclass('CustomError', {
  custom: class extends BasePluginError {
    prop = true
  },
})

expectAssignable<ErrorClass>(CustomPluginError)
expectAssignable<BareErrorClass>(CustomPluginError)
expectAssignable<FullErrorClass>(CustomPluginError)

const WidePluginError = ModernError.subclass('WideError', {
  plugins: [{} as Plugin],
})

expectAssignable<ErrorClass>(WidePluginError)
expectAssignable<BareErrorClass>(WidePluginError)
expectNotAssignable<FullErrorClass>(WidePluginError)

const WideChildPluginError = WidePluginError.subclass('WideChildError')

expectAssignable<ErrorClass>(WideChildPluginError)
expectAssignable<BareErrorClass>(WideChildPluginError)
expectNotAssignable<FullErrorClass>(WideChildPluginError)

const CustomWidePluginError = WidePluginError.subclass('CustomWideError', {
  custom: class extends WidePluginError {
    prop = true
  },
})

expectAssignable<ErrorClass>(CustomWidePluginError)
expectAssignable<BareErrorClass>(CustomWidePluginError)
expectNotAssignable<FullErrorClass>(CustomWidePluginError)

const PluginBaseError = ModernError.subclass('PluginBaseError', {
  plugins: [{ name: 'test' as const, properties: () => ({}) }],
})

const PluginChildError = PluginBaseError.subclass('PluginChildError')
const PluginDeepChildError = PluginChildError.subclass('PluginDeepChildError')
const PluginCustomError = PluginBaseError.subclass('PluginCustomError', {
  custom: class extends PluginBaseError {
    prop = false as const
  },
})
const ConflictCustomError = PluginBaseError.subclass('ConflictCustomError', {
  custom: class extends PluginBaseError {
    prop = true as const
  },
})
const PluginChildCustomError = PluginCustomError.subclass(
  'PluginChildCustomError',
)
const PluginDeepCustomError = PluginCustomError.subclass(
  'PluginDeepCustomError',
  {
    custom: class extends PluginCustomError {
      propTwo = true
    },
  },
)

const pluginBaseError = new PluginBaseError('')
const pluginChildError = new PluginChildError('')
const pluginDeepChildError = new PluginDeepChildError('')
const pluginCustomError = new PluginCustomError('')
const pluginChildCustomError = new PluginChildCustomError('')
const pluginDeepCustomError = new PluginDeepCustomError('')

const exception = {} as unknown

if (exception instanceof BaseError) {
  expectType<typeof BaseError['prototype']>(exception)
}

if (exception instanceof PluginChildError) {
  expectType<typeof PluginChildError['prototype']>(exception)
}

if (exception instanceof PluginDeepChildError) {
  expectType<typeof PluginDeepChildError['prototype']>(exception)
}

if (exception instanceof PluginCustomError) {
  expectType<typeof PluginCustomError['prototype']>(exception)
}

if (exception instanceof PluginChildCustomError) {
  expectType<typeof PluginChildCustomError['prototype']>(exception)
}

if (exception instanceof PluginDeepCustomError) {
  expectType<typeof PluginDeepCustomError['prototype']>(exception)
}

if (pluginChildError instanceof PluginChildError) {
  expectType<typeof pluginChildError>(pluginChildError)
}

if (pluginDeepChildError instanceof PluginDeepChildError) {
  expectType<typeof pluginDeepChildError>(pluginDeepChildError)
}

if (pluginCustomError instanceof PluginCustomError) {
  expectType<typeof pluginCustomError>(pluginCustomError)
}

if (pluginChildCustomError instanceof PluginChildCustomError) {
  expectType<typeof pluginChildCustomError>(pluginChildCustomError)
}

if (pluginDeepCustomError instanceof PluginDeepCustomError) {
  expectType<typeof pluginDeepCustomError>(pluginDeepCustomError)
}

if (pluginBaseError instanceof PluginBaseError) {
  expectType<typeof pluginBaseError>(pluginBaseError)
}

if (pluginChildError instanceof PluginBaseError) {
  expectType<typeof pluginChildError>(pluginChildError)
}

if (pluginDeepChildError instanceof PluginBaseError) {
  expectType<typeof pluginDeepChildError>(pluginDeepChildError)
}

if (pluginCustomError instanceof PluginBaseError) {
  expectType<typeof pluginCustomError>(pluginCustomError)
}

if (pluginChildCustomError instanceof PluginBaseError) {
  expectType<typeof pluginChildCustomError>(pluginChildCustomError)
}

if (pluginDeepCustomError instanceof PluginBaseError) {
  expectType<typeof pluginDeepCustomError>(pluginDeepCustomError)
}

if (pluginBaseError instanceof Error) {
  expectType<typeof pluginBaseError>(pluginBaseError)
}

if (pluginChildError instanceof Error) {
  expectType<typeof pluginChildError>(pluginChildError)
}

if (pluginDeepChildError instanceof Error) {
  expectType<typeof pluginDeepChildError>(pluginDeepChildError)
}

if (pluginCustomError instanceof Error) {
  expectType<typeof pluginCustomError>(pluginCustomError)
}

if (pluginChildCustomError instanceof Error) {
  expectType<typeof pluginChildCustomError>(pluginChildCustomError)
}

if (pluginDeepCustomError instanceof Error) {
  expectType<typeof pluginDeepCustomError>(pluginDeepCustomError)
}

if (pluginDeepChildError instanceof PluginChildError) {
  expectType<typeof pluginDeepChildError>(pluginDeepChildError)
}

if (pluginChildCustomError instanceof PluginCustomError) {
  expectType<typeof pluginChildCustomError>(pluginChildCustomError)
}

if (pluginDeepCustomError instanceof PluginCustomError) {
  expectType<typeof pluginDeepCustomError>(pluginDeepCustomError)
}

if (pluginCustomError instanceof ConflictCustomError) {
  expectType<never>(pluginCustomError)
}

if (pluginChildCustomError instanceof ConflictCustomError) {
  expectType<never>(pluginChildCustomError)
}

if (pluginDeepCustomError instanceof ConflictCustomError) {
  expectType<never>(pluginDeepCustomError)
}
