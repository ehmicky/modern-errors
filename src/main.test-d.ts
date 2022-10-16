import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import type { ErrorName } from 'error-custom-class'

/**
 * Known limitations of current types:
 *  - If two `plugin.properties()` return the same property, they are
 *    intersected using `&`, instead of the second one overriding the first.
 *    Therefore, the type of `plugin.properties()` that are not unique should
 *    currently be wide to avoid the `&` intersection resulting in `never`.
 *  - Type narrowing with `instanceof` does not always work due to:
 *      https://github.com/microsoft/TypeScript/issues/50844
 *    This applies:
 *     - With `AnyError` if there are any plugins with static methods
 *     - With any error class with a `custom` option
 *  - `AnyError` does not always respect proper inheritance, i.e. it sometimes
 *    has stronger constraints than its subclasses, resulting in the following
 *    runtime behavior which cannot be typed:
 *     - `new AnyError()` should require a second argument as an object with a
 *       `cause` property
 */
import modernErrors, {
  AnyErrorClass,
  ErrorClass,
  ErrorInstance,
  Plugin,
  Info,
} from './main.js'

const exception = {} as unknown
const genericError = {} as Error & { genericProp: true }

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>
const wideError = {} as any as AnyInstance
expectAssignable<AnyErrorClass>(AnyError)
expectAssignable<ErrorClass>(AnyError)
expectAssignable<ErrorInstance>(wideError)
expectAssignable<Error>(wideError)
expectType<ErrorName>(wideError.name)

const unknownError = new AnyError('', { cause: genericError })
const bareUnknownError = new AnyError('', { cause: '' })
type UnknownInstance = typeof bareUnknownError

expectAssignable<AnyInstance>(unknownError)
expectAssignable<ErrorInstance>(unknownError)
expectAssignable<Error>(unknownError)
expectType<'UnknownError'>(unknownError.name)
expectType<true>(unknownError.genericProp)
expectAssignable<UnknownInstance>(unknownError)
expectType<UnknownInstance>(new AnyError('', { cause: undefined }))
expectAssignable<UnknownInstance>(AnyError.normalize(genericError))
expectAssignable<UnknownInstance>(AnyError.normalize(''))
expectAssignable<UnknownInstance>(AnyError.normalize(undefined))
expectType<ErrorName>({} as ReturnType<typeof AnyError.normalize>['name'])
if (unknownError instanceof AnyError) {
  expectAssignable<UnknownInstance>(unknownError)
}

const SError = AnyError.subclass('SError')
type SInstance = typeof SError['prototype']
const sError = new SError('')
expectNotAssignable<AnyErrorClass>(SError)
expectAssignable<ErrorClass>(SError)
expectType<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<ErrorInstance>(sError)
expectAssignable<Error>(sError)
expectType<'SError'>(sError.name)
expectError(SError.normalize(''))
if (exception instanceof SError) {
  expectType<SInstance>(exception)
}

const anyError = new AnyError('', { cause: sError })
expectError(new AnyError())
expectError(new AnyError(true))
expectError(new AnyError('', true))
expectError(new AnyError('', { unknown: true }))
expectAssignable<SInstance>(anyError)
expectAssignable<ErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectType<'SError'>(anyError.name)
expectAssignable<SInstance>(AnyError.normalize(sError))
expectError(AnyError.normalize('', true))
if (exception instanceof AnyError) {
  expectAssignable<AnyInstance>(exception)
}

const SSError = SError.subclass('SSError')
type SSInstance = typeof SSError['prototype']

const ssError = new SSError('')
expectNotAssignable<AnyErrorClass>(SSError)
expectAssignable<ErrorClass>(SSError)
expectType<SSInstance>(ssError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<ErrorInstance>(ssError)
expectAssignable<Error>(ssError)
expectType<'SSError'>(ssError.name)
expectError(SSError.normalize(''))
if (exception instanceof SSError) {
  expectType<SSInstance>(exception)
}

class BCError extends AnyError {
  constructor(
    message: ConstructorParameters<typeof AnyError>[0],
    options?: ConstructorParameters<typeof AnyError>[1] & { cProp?: true },
    extra?: true,
  ) {
    super(message, options, extra)
  }
  prop = true as const
  static staticProp = true as const
}
const CError = AnyError.subclass('CError', { custom: BCError })
type CInstance = typeof CError['prototype']

const cError = new CError('', { cProp: true })
expectError(new CError())
expectError(new CError(true))
expectError(new CError('', true))
expectError(new CError('', { unknown: true }))
expectError(new CError('', { cProp: false }))
expectNotAssignable<AnyErrorClass>(CError)
expectAssignable<ErrorClass>(CError)
expectAssignable<CInstance>(cError)
expectAssignable<AnyInstance>(cError)
expectAssignable<ErrorInstance>(cError)
expectAssignable<Error>(cError)
expectType<true>(cError.prop)
expectType<true>(CError.staticProp)
expectType<'CError'>(cError.name)
expectError(CError.normalize(''))

const SCError = CError.subclass('SCError')
type SCInstance = typeof SCError['prototype']

const scError = new SCError('', { cProp: true })
expectError(new SCError())
expectError(new SCError(true))
expectError(new SCError('', true))
expectError(new SCError('', { unknown: true }))
expectError(new SCError('', { cProp: false }))
expectNotAssignable<AnyErrorClass>(SCError)
expectAssignable<ErrorClass>(SCError)
expectAssignable<SCInstance>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<ErrorInstance>(scError)
expectAssignable<Error>(scError)
expectType<true>(scError.prop)
expectType<true>(SCError.staticProp)
expectType<'SCError'>(scError.name)
expectError(SCError.normalize(''))

class BCSError extends SError {
  constructor(
    message: ConstructorParameters<typeof SError>[0],
    options?: ConstructorParameters<typeof SError>[1] & { cProp?: true },
    extra?: true,
  ) {
    super(message, options, extra)
  }
  prop = true as const
  static staticProp = true as const
}
const CSError = CError.subclass('CSError', { custom: BCSError })
type CSInstance = typeof CSError['prototype']

const csError = new CSError('', { cProp: true })
expectError(new CSError())
expectError(new CSError(true))
expectError(new CSError('', true))
expectError(new CSError('', { unknown: true }))
expectError(new CSError('', { cProp: false }))
expectNotAssignable<AnyErrorClass>(CSError)
expectAssignable<ErrorClass>(CSError)
expectAssignable<CSInstance>(csError)
expectAssignable<AnyInstance>(csError)
expectAssignable<ErrorInstance>(csError)
expectAssignable<Error>(csError)
expectType<true>(csError.prop)
expectType<true>(CSError.staticProp)
expectType<'CSError'>(csError.name)
expectError(CSError.normalize(''))

class BCCError extends CError {
  constructor(
    message: ConstructorParameters<typeof CError>[0],
    options?: ConstructorParameters<typeof CError>[1] & { ccProp?: true },
    extra?: boolean,
  ) {
    super(message, options, true)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const CCError = CError.subclass('CCError', { custom: BCCError })
type CCInstance = typeof CCError['prototype']

const ccError = new CCError('', { cProp: true, ccProp: true })
expectError(new CCError())
expectError(new CCError(true))
expectError(new CCError('', true))
expectError(new CCError('', { unknown: true }))
expectError(new CCError('', { cProp: false }))
expectError(new CCError('', { ccProp: false }))
expectNotAssignable<AnyErrorClass>(CCError)
expectAssignable<ErrorClass>(CCError)
expectAssignable<CCInstance>(ccError)
expectAssignable<AnyInstance>(ccError)
expectAssignable<ErrorInstance>(ccError)
expectAssignable<Error>(ccError)
expectType<true>(ccError.prop)
expectType<true>(ccError.deepProp)
expectType<true>(CCError.staticProp)
expectType<true>(CCError.deepStaticProp)
expectType<'CCError'>(ccError.name)
expectError(CCError.normalize(''))

expectType<[true]>(
  new AnyError('', { cause: '', errors: [true] as [true] }).errors,
)
expectAssignable<[true]>(
  new CCError('', { cause: '', errors: [true] as [true] }).errors,
)
expectType<unknown[] | undefined>(new AnyError('', { cause: '' }).errors)
expectType<unknown[] | undefined>(new CCError('').errors)
expectError(new AnyError('', { cause: '', errors: true }))
expectError(new CCError('', { errors: true }))

expectType<true>(
  new AnyError('', { cause: '', props: { one: true as const } }).one,
)
expectType<true>(new CCError('', { props: { one: true as const } }).one)
modernErrors([], { props: {} })
AnyError.subclass('TestError', { props: {} })
SError.subclass('TestError', { props: {} })
new AnyError('', { cause: '', props: {} })
new CCError('', { cause: '', props: {} })
expectError(modernErrors([], { props: true }))
expectError(AnyError.subclass('TestError', { props: true }))
expectError(SError.subclass('TestError', { props: true }))
expectError(new AnyError('', { cause: '', props: true }))
expectError(new CCError('', { props: true }))

const name = 'test'
const getOptions = (input: true, full: boolean) => input
const isOptions = (input: unknown) => input === true
const instanceMethod = (info: Info['instanceMethods'], arg: 'arg') => arg
const instanceMethods = { instanceMethod }
const staticMethod = (info: Info['staticMethods'], arg: 'arg') => arg
const staticMethods = { staticMethod }
const properties = (info: Info['properties']) => ({ property: true as const })
const plugin = {
  name,
  getOptions,
  isOptions,
  instanceMethods,
  staticMethods,
  properties,
} as const

const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
const GPAnyError = modernErrors([{} as Plugin])
const GPSError = GPAnyError.subclass('GPSError')
type PAnyErrorClass = AnyErrorClass<[typeof plugin]>
type PErrorClass = ErrorClass<[typeof plugin]>

expectAssignable<AnyErrorClass>(PAnyError)
expectAssignable<PAnyErrorClass>(PAnyError)
expectAssignable<ErrorClass>(PAnyError)
expectAssignable<PErrorClass>(PAnyError)
expectNotAssignable<AnyErrorClass>(PSError)
expectNotAssignable<PAnyErrorClass>(PSError)
expectAssignable<ErrorClass>(PSError)
expectAssignable<PErrorClass>(PSError)
expectAssignable<AnyErrorClass>(GPAnyError)
expectNotAssignable<PAnyErrorClass>(GPAnyError)
expectAssignable<ErrorClass>(GPAnyError)
expectNotAssignable<PErrorClass>(GPAnyError)
expectNotAssignable<AnyErrorClass>(GPSError)
expectNotAssignable<PAnyErrorClass>(GPSError)
expectAssignable<ErrorClass>(GPSError)
expectNotAssignable<PErrorClass>(GPSError)

const paError = new PAnyError('', { cause: genericError })
const psError = new PSError('')
const gpaError = new GPAnyError('', { cause: genericError })
const gpsError = new GPSError('')
type PErrorInstance = ErrorInstance<[typeof plugin]>

expectAssignable<Error>(paError)
expectAssignable<ErrorInstance>(paError)
expectAssignable<PErrorInstance>(paError)
expectAssignable<Error>(psError)
expectAssignable<ErrorInstance>(psError)
expectAssignable<PErrorInstance>(psError)
expectAssignable<Error>(gpaError)
expectAssignable<ErrorInstance>(gpaError)
expectNotAssignable<PErrorInstance>(gpaError)
expectAssignable<Error>(gpsError)
expectAssignable<ErrorInstance>(gpsError)
expectNotAssignable<PErrorInstance>(gpsError)

modernErrors([])
modernErrors([], {})
modernErrors([plugin], {})
expectError(modernErrors(true))
modernErrors([plugin], { test: true })
PAnyError.subclass('PSError', { test: true })
new PAnyError('', { test: true })
new PSError('', { test: true })
expectError(modernErrors([], { test: true }))
expectError(modernErrors([plugin as Plugin], { test: true }))
expectError(modernErrors([{ ...plugin, name: '' as string }], { test: true }))
expectError(
  modernErrors([plugin as Omit<typeof plugin, 'getOptions'>], { test: true }),
)

expectAssignable<Plugin>(plugin)
expectAssignable<Plugin>({ name })
expectNotAssignable<Plugin>({})
expectNotAssignable<Plugin>({ name, unknown: true })
expectNotAssignable<Plugin>({ ...plugin, getOptions: true })
expectAssignable<Plugin>({ ...plugin, getOptions: () => true })
expectNotAssignable<Plugin>({
  ...plugin,
  getOptions: (input: true, full: string) => input,
})
expectNotAssignable<Plugin>({ ...plugin, isOptions: true })
expectNotAssignable<Plugin>({ ...plugin, isOptions: (input: true) => true })
expectNotAssignable<Plugin>({ ...plugin, isOptions: (input: unknown) => 0 })
expectAssignable<Plugin>({ ...plugin, instanceMethods: {} })
expectNotAssignable<Plugin>({ ...plugin, instanceMethods: true })
expectNotAssignable<Plugin>({
  ...plugin,
  instanceMethods: { instanceMethod: true },
})
expectAssignable<Plugin>({ ...plugin, staticMethods: {} })
expectNotAssignable<Plugin>({ ...plugin, staticMethods: true })
expectNotAssignable<Plugin>({
  ...plugin,
  staticMethods: { staticMethod: true },
})
expectNotAssignable<Plugin>({ ...plugin, properties: true })
expectNotAssignable<Plugin>({ ...plugin, properties: (info: true) => ({}) })
expectNotAssignable<Plugin>({
  ...plugin,
  properties: (info: Info['properties'], arg: true) => ({}),
})
expectNotAssignable<Plugin>({
  ...plugin,
  properties: (info: Info['properties']) => true,
})
expectNotAssignable<Plugin>({
  ...plugin,
  properties: (info: Info['properties']) => [],
})

const imInfo = {} as Info['instanceMethods']
expectError(imInfo.unknown)
expectAssignable<Error>(imInfo.error)
expectAssignable<boolean>(imInfo.options)
expectType<boolean>(imInfo.showStack)
expectAssignable<typeof AnyError>(imInfo.AnyError)
expectAssignable<AnyErrorClass>(imInfo.AnyError)
expectAssignable<object>(imInfo.ErrorClasses)
expectError(imInfo.ErrorClasses.unknown)
expectError(new imInfo.ErrorClasses.AnyError('', { cause: genericError }))
const iUnknownError = new imInfo.ErrorClasses.UnknownError('')
expectAssignable<UnknownInstance>(iUnknownError)
expectAssignable<Function | undefined>(imInfo.ErrorClasses.SError)
expectAssignable<typeof imInfo.ErrorClasses.TestError>(SError)

const smInfo = {} as Info['staticMethods']
expectType<Info['instanceMethods']['options']>(smInfo.options)
expectType<Info['instanceMethods']['AnyError']>(smInfo.AnyError)
expectType<Info['instanceMethods']['ErrorClasses']>(smInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(smInfo.errorInfo)
expectError(smInfo.error)
expectError(smInfo.showStack)

const pInfo = {} as Info['properties']
expectType<Info['instanceMethods']['error']>(pInfo.error)
expectType<Info['instanceMethods']['options']>(pInfo.options)
expectType<Info['instanceMethods']['showStack']>(pInfo.showStack)
expectType<Info['instanceMethods']['AnyError']>(pInfo.AnyError)
expectType<Info['instanceMethods']['ErrorClasses']>(pInfo.ErrorClasses)
expectType<Info['instanceMethods']['errorInfo']>(pInfo.errorInfo)

const eInfo = imInfo.errorInfo(iUnknownError)
imInfo.errorInfo('')
expectType<Info['errorInfo']>(eInfo)
expectType<Info['instanceMethods']['error']>(eInfo.error)
expectType<Info['instanceMethods']['options']>(eInfo.options)
expectType<Info['instanceMethods']['showStack']>(eInfo.showStack)
expectError(eInfo.AnyError)
expectError(eInfo.ErrorClasses)
expectError(eInfo.errorInfo)

expectType<'arg'>(paError.instanceMethod('arg'))
expectType<'arg'>(psError.instanceMethod('arg'))
expectType<'arg'>(paError.instanceMethod('arg', true))
expectType<'arg'>(psError.instanceMethod('arg', true))
expectError(paError.instanceMethod({} as Info['instanceMethods'], 'arg'))
expectError(psError.instanceMethod({} as Info['instanceMethods'], 'arg'))
expectError(paError.instanceMethod('arg', false))
expectError(psError.instanceMethod('arg', false))
expectError(paError.instanceMethod(true))
expectError(psError.instanceMethod(true))
expectError(paError.unknownMethod())
expectError(psError.unknownMethod())
expectError(gpaError.unknownMethod())
expectError(gpsError.unknownMethod())
if (exception instanceof PSError) {
  expectType<'arg'>(exception.instanceMethod('arg'))
}

expectType<'arg'>(PAnyError.staticMethod('arg'))
expectType<'arg'>(PAnyError.staticMethod('arg', true))
expectError(
  expectType<'arg'>(PAnyError.staticMethod({} as Info['staticMethods'], 'arg')),
)
expectError(expectType<'arg'>(PAnyError.staticMethod('arg', false)))
expectError(expectType<'arg'>(PAnyError.staticMethod(true)))
expectError(PSError.staticMethod())
expectError(GPSError.staticMethod())
expectError(PAnyError.unknownMethod())
expectError(GPAnyError.unknownMethod())
expectError(PSError.unknownMethod())
expectError(GPSError.unknownMethod())

expectType<true>(paError.property)
expectType<true>(psError.property)
expectError(paError.unknownProperty)
expectError(psError.unknownProperty)
expectError(gpaError.unknownProperty)
expectError(gpsError.unknownProperty)
if (exception instanceof PSError) {
  expectType<true>(exception.property)
}

expectType<'GPSError'>(gpsError.name)
expectAssignable<InstanceType<typeof GPSError>>(gpsError)
expectAssignable<InstanceType<typeof GPAnyError>>(gpsError)
expectAssignable<InstanceType<typeof GPAnyError>>(GPAnyError.normalize(''))
if (exception instanceof GPAnyError) {
  expectAssignable<InstanceType<typeof GPAnyError>>(exception)
}
if (exception instanceof GPSError) {
  expectAssignable<InstanceType<typeof GPSError>>(exception)
}

expectError(AnyError.subclass('TestError', { test: true }))
expectError(new AnyError('', { cause: '', test: true }))
expectError(new SError('', { test: true }))
expectError(new SError('', { cause: '', test: true }))
expectError(modernErrors([plugin], { unknown: true }))
expectError(PAnyError.subclass('TestError', { unknown: true }))
expectError(new PAnyError('', { unknown: true }))
expectError(new PSError('', { unknown: true }))
expectError(modernErrors([plugin], { test: 'true' }))
expectError(PAnyError.subclass('TestError', { test: 'true' }))
expectError(new PAnyError('', { test: 'true' }))
expectError(new PSError('', { test: 'true' }))

expectError(AnyError.subclass())
expectError(AnyError.subclass({}))
expectError(AnyError.subclass('Test'))
expectError(AnyError.subclass('TestError', true))
expectError(AnyError.subclass('TestError', { unknown: true }))
expectError(AnyError.subclass('TestError', { custom: true }))

expectError(AnyError.subclass('TestError', { custom: class {} }))
expectError(AnyError.subclass('TestError', { custom: class extends Object {} }))
expectError(AnyError.subclass('TestError', { custom: class extends Error {} }))
expectError(CError.subclass('TestError', { custom: class extends AnyError {} }))
expectError(CCError.subclass('TestError', { custom: class extends CError {} }))

AnyError.subclass('TestError', {
  custom: class extends AnyError {
    constructor(
      message: ConstructorParameters<typeof AnyError>[0],
      options?: ConstructorParameters<typeof AnyError>[1],
    ) {
      super(message, options)
    }
  },
})
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(options?: object) {
        super('', options)
      }
    },
  }),
)
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(
        message: ConstructorParameters<typeof AnyError>[0],
        options?: true,
      ) {
        super(message, options)
      }
    },
  }),
)
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(
        message: ConstructorParameters<typeof AnyError>[0],
        options?: ConstructorParameters<typeof AnyError>[1] & { cause?: true },
      ) {
        super(message, options)
      }
    },
  }),
)
AnyError.subclass('TestError', {
  custom: class extends CError {
    constructor(
      message: ConstructorParameters<typeof AnyError>[0],
      options?: ConstructorParameters<typeof AnyError>[1],
    ) {
      super(message, options)
    }
  },
})
expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(
        message: ConstructorParameters<typeof CError>[0],
        options?: ConstructorParameters<typeof CError>[1] & { cProp?: false },
        extra?: ConstructorParameters<typeof CError>[2],
      ) {
        super(message, options, extra)
      }
    },
  }),
)
expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(
        message: ConstructorParameters<typeof CError>[0],
        options?: ConstructorParameters<typeof CError>[1],
        extra?: false,
      ) {
        super(message, options, true)
      }
    },
  }),
)
expectError(
  class extends CError {
    constructor() {
      super('', {}, false)
    }
  },
)

if (cError instanceof SError) {
  expectType<never>(cError)
}
if (cError instanceof CError) {
  expectAssignable<CInstance>(cError)
}
if (cError instanceof AnyError) {
  expectAssignable<CInstance>(cError)
}
if (cError instanceof Error) {
  expectAssignable<CInstance>(cError)
}
