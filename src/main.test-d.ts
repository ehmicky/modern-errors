import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { InstanceMethodInfo, ErrorInfo } from './main.js'

type ErrorName = `${string}Error`

const exception = {} as unknown
const genericError = {} as Error & { genericProp: true }
const deepGenericError = {} as Error & { cause: Error & { genericProp: true } }

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>
const wideError = {} as any as AnyInstance
expectAssignable<Error>(wideError)
expectType<ErrorName>(wideError.name)

const unknownError = new AnyError('', { cause: genericError })
const deepUnknownError = new AnyError('', { cause: deepGenericError })
const bareUnknownError = new AnyError('', { cause: '' })
type UnknownInstance = typeof bareUnknownError

expectAssignable<AnyInstance>(unknownError)
expectAssignable<Error>(unknownError)
expectType<'UnknownError'>(unknownError.name)
expectType<true>(unknownError.genericProp)
// TODO: re-enable
// expectType<true>(deepUnknownError.genericProp)
expectAssignable<UnknownInstance>(unknownError)
expectType<UnknownInstance>(new AnyError('', { cause: undefined }))
expectAssignable<UnknownInstance>(AnyError.normalize(genericError))
expectType<UnknownInstance>(AnyError.normalize(''))
expectType<UnknownInstance>(AnyError.normalize(undefined))
expectType<ErrorName>({} as ReturnType<typeof AnyError.normalize>['name'])
if (unknownError instanceof AnyError) {
  expectAssignable<UnknownInstance>(unknownError)
}

const SError = AnyError.subclass('SError')
type SInstance = typeof SError['prototype']
const sError = new SError('')
expectType<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
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
expectType<SSInstance>(ssError)
expectAssignable<AnyInstance>(ssError)
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
expectType<CInstance>(cError)
expectAssignable<AnyInstance>(cError)
expectAssignable<Error>(cError)
expectType<true>(cError.prop)
expectType<true>(CError.staticProp)
expectType<'CError'>(cError.name)
expectError(CError.normalize(''))
// Type narrowing with `instanceof` of error classes with a `custom` option
// does not work due to:
// https://github.com/microsoft/TypeScript/issues/50844
// if (exception instanceof CError) {
//   expectType<CInstance>(exception)
// }

const SCError = CError.subclass('SCError')
type SCInstance = typeof SCError['prototype']

const scError = new SCError('', { cProp: true })
expectError(new SCError())
expectError(new SCError(true))
expectError(new SCError('', true))
expectError(new SCError('', { unknown: true }))
expectError(new SCError('', { cProp: false }))
expectType<SCInstance>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<Error>(scError)
expectType<true>(scError.prop)
expectType<true>(SCError.staticProp)
expectType<'SCError'>(scError.name)
expectError(SCError.normalize(''))
// See above
// if (exception instanceof SCError) {
//   expectType<SCInstance>(exception)
// }

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
expectType<CSInstance>(csError)
expectAssignable<AnyInstance>(csError)
expectAssignable<Error>(csError)
expectType<true>(csError.prop)
expectType<true>(CSError.staticProp)
expectType<'CSError'>(csError.name)
expectError(CSError.normalize(''))
// See above
// if (exception instanceof CSError) {
//   expectType<CSInstance>(exception)
// }

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
expectType<CCInstance>(ccError)
expectAssignable<AnyInstance>(ccError)
expectAssignable<Error>(ccError)
expectType<true>(ccError.prop)
expectType<true>(ccError.deepProp)
expectType<true>(CCError.staticProp)
expectType<true>(CCError.deepStaticProp)
expectType<'CCError'>(ccError.name)
expectError(CCError.normalize(''))
// See above
// if (exception instanceof CCError) {
//   expectType<CCInstance>(exception)
// }

expectType<[true]>(new AnyError('', { errors: [true] as [true] }).errors)
expectAssignable<[true]>(new CCError('', { errors: [true] as [true] }).errors)
expectType<unknown[] | undefined>(new AnyError('').errors)
expectType<unknown[] | undefined>(new CCError('').errors)
expectNotAssignable<
  NonNullable<ConstructorParameters<typeof AnyError>[1]>['errors']
>(new Error(''))
expectNotAssignable<
  NonNullable<ConstructorParameters<typeof CCError>[1]>['errors']
>(new Error(''))

const name = 'test'
const getOptions = (options: true, full: boolean) => options
const instanceMethod = (info: InstanceMethodInfo, value: true) => value
const instanceMethods = { instanceMethod }
const plugin = { name, getOptions, instanceMethods } as const
const PAnyError = modernErrors([plugin])
const PSError = PAnyError.subclass('PSError')
modernErrors([])
modernErrors([], {})
modernErrors([plugin], {})
expectError(modernErrors(true))
modernErrors([plugin], { test: true })
modernErrors([{ name }])
expectError(modernErrors([{}]))
expectError(modernErrors([{ name, unknown: true }]))
PAnyError.subclass('PSError', { test: true })
new PAnyError('', { test: true })
new PSError('', { test: true })
expectError(modernErrors([], { test: true }))
expectError(modernErrors([{ ...plugin, name: '' as string }], { test: true }))
expectError(
  modernErrors([plugin as Omit<typeof plugin, 'getOptions'>], { test: true }),
)
expectError(
  modernErrors([
    { ...plugin, getOptions: (options: true, full: string) => options },
  ]),
)
modernErrors([{ ...plugin, instanceMethods: {} }])
expectError(modernErrors([{ ...plugin, instanceMethods: true }]))
expectError(
  modernErrors([{ ...plugin, instanceMethods: { instanceMethod: true } }]),
)

const imInfo = {} as InstanceMethodInfo
expectError(imInfo.unknown)
expectAssignable<Error>(imInfo.error)
expectAssignable<boolean>(imInfo.options)
expectType<boolean>(imInfo.showStack)
expectAssignable<typeof AnyError>(imInfo.AnyError)
expectAssignable<object>(imInfo.ErrorClasses)
expectError(imInfo.ErrorClasses.unknown)
expectError(new imInfo.ErrorClasses.AnyError('', { cause: genericError }))
const iUnknownError = new imInfo.ErrorClasses.UnknownError('')
expectAssignable<UnknownInstance>(iUnknownError)
expectAssignable<Function | undefined>(imInfo.ErrorClasses.SError)
expectAssignable<typeof imInfo.ErrorClasses.TestError>(SError)

expectError(imInfo.errorInfo(true))
const eInfo = imInfo.errorInfo(iUnknownError)
expectType<ErrorInfo>(eInfo)
expectType<InstanceMethodInfo['error']>(eInfo.error)
expectType<InstanceMethodInfo['options']>(eInfo.options)
expectType<InstanceMethodInfo['showStack']>(eInfo.showStack)
expectError(eInfo.AnyError)
expectError(eInfo.ErrorClasses)
expectError(eInfo.errorInfo)

expectError(AnyError.subclass('TestError', { test: true }))
expectError(new AnyError('', { test: true }))
expectError(new SError('', { test: true }))
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
  expectType<CInstance>(cError)
}
if (cError instanceof AnyError) {
  expectType<CInstance>(cError)
}
if (cError instanceof Error) {
  expectType<CInstance>(cError)
}
