import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from './main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

expectError(modernErrors(true))

const SError = AnyError.subclass('SError')
type SInstance = InstanceType<typeof SError>

class BCError extends AnyError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CError = AnyError.subclass('CError', { custom: BCError })
type CInstance = InstanceType<typeof CError>

const SSError = SError.subclass('SSError')
type SSInstance = InstanceType<typeof SSError>

const SCError = CError.subclass('SCError')
type SCInstance = InstanceType<typeof SCError>

class BCCError extends CError {
  constructor(message: string | boolean | number, options?: object) {
    super(String(message), options)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const CCError = CError.subclass('CCError', { custom: BCCError })
type CCInstance = InstanceType<typeof CCError>

expectError(AnyError.subclass())
expectError(AnyError.subclass({}))
expectError(AnyError.subclass('Test'))
expectError(
  AnyError.subclass('TestError', {
    custom: class extends AnyError {
      constructor(message: boolean, options?: object) {
        super(String(message), options)
      }
    },
  }),
)

const sError = new SError('')
expectType<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<Error>(sError)
expectError(SError.staticProp)
expectType<'SError'>(sError.name)
expectError(sError.prop)

const cError = new CError(true)
expectType<CInstance>(cError)
expectAssignable<BCError>(cError)
expectAssignable<AnyInstance>(cError)
expectAssignable<Error>(cError)
expectType<true>(CError.staticProp)
expectType<'CError'>(cError.name)
expectType<true>(cError.prop)

const dsError = new SSError('')
expectType<SSInstance>(dsError)
expectAssignable<AnyInstance>(dsError)
expectAssignable<Error>(dsError)
expectError(SSError.staticProp)
expectType<'SSError'>(dsError.name)
expectError(dsError.prop)

const scError = new SCError(true)
expectType<SCInstance>(scError)
expectAssignable<BCError>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<Error>(scError)
expectType<true>(SCError.staticProp)
expectType<'SCError'>(scError.name)
expectType<true>(scError.prop)

const ccError = new CCError(0)
expectType<CCInstance>(ccError)
expectAssignable<BCError>(ccError)
expectAssignable<AnyInstance>(ccError)
expectAssignable<Error>(ccError)
expectType<true>(CCError.staticProp)
expectType<true>(CCError.deepStaticProp)
expectType<'CCError'>(ccError.name)
expectType<true>(ccError.prop)
expectType<true>(ccError.deepProp)

const anyError = new AnyError('')
expectType<AnyInstance>(anyError)
expectAssignable<Error>(anyError)
expectError(AnyError.staticProp)
expectError(anyError.prop)

expectType<AnyInstance>(AnyError.normalize(''))
expectError(SError.normalize(''))
expectError(SSError.normalize(''))
expectError(CError.normalize(''))
expectError(SCError.normalize(''))
expectError(CCError.normalize(''))
expectError(AnyError.normalize('', true))

const error = new Error('')

if (error instanceof AnyError) {
  expectType<AnyInstance>(error)
}

// Type narrowing with `instanceof` of error classes with a `custom` option
// does not work due to:
// https://github.com/microsoft/TypeScript/issues/50844
// if (anyError instanceof CError) {
//   expectType<CInstance>(anyError)
// }
// if (anyError instanceof SCError) {
//   expectType<SCInstance>(anyError)
// }
// if (anyError instanceof CCError) {
//   expectType<CCInstance>(anyError)
// }

if (anyError instanceof SError) {
  expectType<SInstance>(anyError)
}
if (anyError instanceof SSError) {
  expectType<SSInstance>(anyError)
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
