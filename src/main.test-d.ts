import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors from './main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const anyError = new AnyError('')
expectType<AnyInstance>(anyError)
expectAssignable<Error>(anyError)
expectError(AnyError.staticProp)
expectError(anyError.prop)
expectType<AnyInstance>(AnyError.normalize(''))
expectError(AnyError.normalize('', true))

const SError = AnyError.subclass('SError')
type SInstance = InstanceType<typeof SError>

const sError = new SError('')
expectType<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<Error>(sError)
expectError(SError.staticProp)
expectError(sError.prop)
expectType<'SError'>(sError.name)
expectError(SError.normalize(''))
if (anyError instanceof SError) {
  expectType<SInstance>(anyError)
}

class BCError extends AnyError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CError = AnyError.subclass('CError', { custom: BCError })
type CInstance = InstanceType<typeof CError>

const cError = new CError(true)
expectType<CInstance>(cError)
expectAssignable<AnyInstance>(cError)
expectAssignable<Error>(cError)
expectType<true>(CError.staticProp)
expectType<true>(cError.prop)
expectType<'CError'>(cError.name)
expectError(CError.normalize(''))
// Type narrowing with `instanceof` of error classes with a `custom` option
// does not work due to:
// https://github.com/microsoft/TypeScript/issues/50844
// if (anyError instanceof CError) {
//   expectType<CInstance>(anyError)
// }

const SSError = SError.subclass('SSError')
type SSInstance = InstanceType<typeof SSError>

const ssError = new SSError('')
expectType<SSInstance>(ssError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<Error>(ssError)
expectError(SSError.staticProp)
expectError(ssError.prop)
expectType<'SSError'>(ssError.name)
expectError(SSError.normalize(''))
if (anyError instanceof SSError) {
  expectType<SSInstance>(anyError)
}

const SCError = CError.subclass('SCError')
type SCInstance = InstanceType<typeof SCError>

const scError = new SCError(true)
expectType<SCInstance>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<Error>(scError)
expectType<true>(SCError.staticProp)
expectType<true>(scError.prop)
expectType<'SCError'>(scError.name)
expectError(SCError.normalize(''))
// See above
// if (anyError instanceof SCError) {
//   expectType<SCInstance>(anyError)
// }

class BCSError extends SError {
  constructor(message: string | boolean, options?: object) {
    super(String(message), options)
  }
  prop = true as const
  static staticProp = true as const
}
const CSError = CError.subclass('CSError', { custom: BCSError })
type CSInstance = InstanceType<typeof CSError>

const csError = new CSError(true)
expectType<CSInstance>(csError)
expectAssignable<AnyInstance>(csError)
expectAssignable<Error>(csError)
expectType<true>(CSError.staticProp)
expectType<true>(csError.prop)
expectType<'CSError'>(csError.name)
expectError(CSError.normalize(''))
// See above
// if (anyError instanceof CSError) {
//   expectType<CSInstance>(anyError)
// }

class BCCError extends CError {
  constructor(message: string | boolean | number, options?: object) {
    super(String(message), options)
  }
  deepProp = true as const
  static deepStaticProp = true as const
}
const CCError = CError.subclass('CCError', { custom: BCCError })
type CCInstance = InstanceType<typeof CCError>

const ccError = new CCError(0)
expectType<CCInstance>(ccError)
expectAssignable<AnyInstance>(ccError)
expectAssignable<Error>(ccError)
expectType<true>(CCError.staticProp)
expectType<true>(CCError.deepStaticProp)
expectType<true>(ccError.prop)
expectType<true>(ccError.deepProp)
expectType<'CCError'>(ccError.name)
expectError(CCError.normalize(''))
// See above
// if (anyError instanceof CCError) {
//   expectType<CCInstance>(anyError)
// }

expectError(modernErrors(true))

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

const error = new Error('')

if (error instanceof AnyError) {
  expectType<AnyInstance>(error)
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
