import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from './main.js'

const genericError = new Error('')

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>
const wideError = {} as any as AnyInstance
expectAssignable<Error>(wideError)
expectType<`${string}Error`>(wideError.name)

const unknownError = new AnyError('', { cause: '' })
type UnknownInstance = typeof unknownError

expectAssignable<AnyInstance>(unknownError)
expectAssignable<Error>(unknownError)
expectType<'UnknownError'>(unknownError.name)
expectType<UnknownInstance>(new AnyError('', { cause: undefined }))
expectType<UnknownInstance>(new AnyError('', { cause: genericError }))
expectType<UnknownInstance>(AnyError.normalize(''))
expectType<UnknownInstance>(AnyError.normalize(undefined))
expectType<UnknownInstance>(AnyError.normalize(genericError))
if (unknownError instanceof AnyError) {
  expectType<UnknownInstance>(unknownError)
}

const SError = AnyError.subclass('SError')
type SInstance = typeof SError['prototype']

const cause = new SError('')
const anyError = new AnyError('', { cause })
expectError(new AnyError())
expectError(new AnyError(true))
expectError(new AnyError('', true))
expectError(new AnyError('', { unknown: true }))
expectType<SInstance>(anyError)
expectAssignable<Error>(anyError)
expectType<'SError'>(anyError.name)
expectType<SInstance>(AnyError.normalize(cause))
expectError(AnyError.normalize('', true))

const sError = new SError('')
expectType<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<Error>(sError)
expectType<'SError'>(sError.name)
expectError(SError.normalize(''))
if (wideError instanceof SError) {
  expectType<SInstance>(wideError)
}

const SSError = SError.subclass('SSError')
type SSInstance = typeof SSError['prototype']

const ssError = new SSError('')
expectType<SSInstance>(ssError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<Error>(ssError)
expectType<'SSError'>(ssError.name)
expectError(SSError.normalize(''))
if (wideError instanceof SSError) {
  expectType<SSInstance>(wideError)
}

class BCError extends AnyError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CError = AnyError.subclass('CError', { custom: BCError })
type CInstance = typeof CError['prototype']

const cError = new CError(true)
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
// if (wideError instanceof CError) {
//   expectType<CInstance>(wideError)
// }

const SCError = CError.subclass('SCError')
type SCInstance = typeof SCError['prototype']

const scError = new SCError(true)
expectType<SCInstance>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<Error>(scError)
expectType<true>(scError.prop)
expectType<true>(SCError.staticProp)
expectType<'SCError'>(scError.name)
expectError(SCError.normalize(''))
// See above
// if (wideError instanceof SCError) {
//   expectType<SCInstance>(wideError)
// }

class BCSError extends SError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CSError = CError.subclass('CSError', { custom: BCSError })
type CSInstance = typeof CSError['prototype']

const csError = new CSError(true)
expectType<CSInstance>(csError)
expectAssignable<AnyInstance>(csError)
expectAssignable<Error>(csError)
expectType<true>(csError.prop)
expectType<true>(CSError.staticProp)
expectType<'CSError'>(csError.name)
expectError(CSError.normalize(''))
// See above
// if (wideError instanceof CSError) {
//   expectType<CSInstance>(wideError)
// }

class BCCError extends CError {
  constructor(message: string | boolean | number, options?: object) {
    super(String(message), options)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const CCError = CError.subclass('CCError', { custom: BCCError })
type CCInstance = typeof CCError['prototype']

const ccError = new CCError(0)
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
// if (wideError instanceof CCError) {
//   expectType<CCInstance>(wideError)
// }

expectError(modernErrors(true))

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
      constructor(message: boolean, options?: object) {
        super(String(message), options)
      }
    },
  }),
)
expectError(
  CError.subclass('TestError', {
    custom: class extends CError {
      constructor(message: string | true, options?: object) {
        super(String(message), options)
      }
    },
  }),
)

if (genericError instanceof AnyError) {
  expectType<AnyInstance>(genericError)
}
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
