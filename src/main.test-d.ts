import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from './main.js'

const exception = {} as unknown
const genericError = {} as Error & { genericProp: true }
const deepGenericError = {} as Error & { cause: Error & { genericProp: true } }

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>
const wideError = {} as any as AnyInstance
expectAssignable<Error>(wideError)
expectType<`${string}Error`>(wideError.name)

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
  constructor(message: string, options?: object | boolean) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CError = AnyError.subclass('CError', { custom: BCError })
type CInstance = typeof CError['prototype']

const cError = new CError('', true)
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

const scError = new SCError('', true)
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
  constructor(message: string, options?: object | boolean) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CSError = CError.subclass('CSError', { custom: BCSError })
type CSInstance = typeof CSError['prototype']

const csError = new CSError('', true)
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
  constructor(message: string, options?: object | boolean | number) {
    super(String(message), options)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const CCError = CError.subclass('CCError', { custom: BCCError })
type CCInstance = typeof CCError['prototype']

const ccError = new CCError('', 0)
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

expectError(modernErrors(true))
expectError(modernErrors([{}]))
modernErrors([])
modernErrors([], {})
const name = 'test'
const getOptions = (options: true) => options
const noOptsPlugin = { name } as const
const plugin = { name, getOptions } as const
modernErrors([plugin])
modernErrors([plugin], {})
modernErrors([plugin], { test: true })
expectError(modernErrors([noOptsPlugin], { test: true }))
expectError(modernErrors([plugin], { other: true }))
expectError(
  modernErrors([{ ...plugin, name: 'test' }, { name: 'two' as const }], {
    test: true,
  }),
)
expectError(modernErrors([plugin], { test: 'true' }))

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
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(message: string, options?: boolean) {
        super(String(message), options)
      }
    },
  }),
)
expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(message: string, options?: object | true) {
        super(String(message), options)
      }
    },
  }),
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
