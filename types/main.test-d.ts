import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import type { ErrorName } from 'error-custom-class'

import modernErrors, {
  AnyErrorClass,
  ErrorClass,
  ErrorInstance,
  GlobalOptions,
  ClassOptions,
  InstanceOptions,
} from './main.js'

import './any/aggregate.test-d.js'
import './any/main.test-d.js'
import './any/modify.test-d.js'
import './any/normalize.test-d.js'
import './core_plugins/props.test-d.js'
import './options/class.test-d.js'
import './options/plugins.test-d.js'
import './plugins/info.test-d.js'
import './plugins/instance.test-d.js'
import './plugins/properties.test-d.js'
import './plugins/shape.test-d.js'
import './plugins/static.test-d.js'
import './subclass/custom.test-d.js'
import './subclass/inherited.test-d.js'
import './subclass/main.test-d.js'
import './subclass/name.test-d.js'
import './subclass/parent.test-d.js'

const exception = {} as unknown

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>
const wideError = {} as any as AnyInstance
expectAssignable<AnyErrorClass>(AnyError)
expectAssignable<ErrorClass>(AnyError)
expectAssignable<ErrorInstance>(wideError)
expectAssignable<Error>(wideError)
expectType<ErrorName>(wideError.name)
expectAssignable<Error>({} as ErrorInstance)
expectType<ErrorInstance>({} as InstanceType<ErrorClass>)

const SError = AnyError.subclass('SError')
type SInstance = typeof SError['prototype']
const sError = new SError('')
expectNotAssignable<AnyErrorClass>(SError)
expectAssignable<ErrorClass>(SError)
expectAssignable<SInstance>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<ErrorInstance>(sError)
expectAssignable<Error>(sError)
expectType<'SError'>(sError.name)
if (exception instanceof SError) {
  expectType<SInstance>(exception)
}

const anyError = new AnyError('', { cause: sError })
expectError(new AnyError())
expectError(new AnyError(true))
expectError(new AnyError('', true))
expectError(new AnyError('', { cause: '', other: true }))
expectAssignable<SInstance>(anyError)
expectAssignable<ErrorInstance>(anyError)
expectAssignable<Error>(anyError)
expectType<'SError'>(anyError.name)
if (exception instanceof AnyError) {
  expectAssignable<AnyInstance>(exception)
}

const SSError = SError.subclass('SSError')
type SSInstance = typeof SSError['prototype']

const ssError = new SSError('')
expectNotAssignable<AnyErrorClass>(SSError)
expectAssignable<ErrorClass>(SSError)
expectAssignable<SSInstance>(ssError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<ErrorInstance>(ssError)
expectAssignable<Error>(ssError)
expectType<'SSError'>(ssError.name)
if (exception instanceof SSError) {
  expectType<SSInstance>(exception)
}

class BCError extends AnyError {
  constructor(
    message: string,
    options?: InstanceOptions & { cProp?: true },
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
expectError(new CError('', { other: true }))
expectError(new CError('', { cause: '', other: true }))
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

const SCError = CError.subclass('SCError')
type SCInstance = typeof SCError['prototype']

const scError = new SCError('', { cProp: true })
expectError(new SCError())
expectError(new SCError(true))
expectError(new SCError('', true))
expectError(new SCError('', { other: true }))
expectError(new SCError('', { cause: '', other: true }))
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

class BCSError extends SError {
  constructor(
    message: string,
    options?: InstanceOptions & { cProp?: true },
    extra?: true,
  ) {
    super(message, options, extra)
  }
  prop = true as const
  static staticProp = true as const
}
const CSError = SError.subclass('CSError', { custom: BCSError })
type CSInstance = typeof CSError['prototype']

const csError = new CSError('', { cProp: true })
expectError(new CSError())
expectError(new CSError(true))
expectError(new CSError('', true))
expectError(new CSError('', { other: true }))
expectError(new CSError('', { cause: '', other: true }))
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

class BCCError extends CError {
  constructor(
    message: string,
    options?: InstanceOptions & { cProp?: true; ccProp?: true },
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
expectError(new CCError('', { other: true }))
expectError(new CCError('', { cause: '', other: true }))
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

expectAssignable<InstanceOptions>({ cause: '' })
expectNotAssignable<GlobalOptions>({ cause: '' })
expectNotAssignable<ClassOptions>({ cause: '' })

modernErrors([])
modernErrors([], {})
modernErrors([{ name: 'test' as const }], {})
expectError(modernErrors(true))

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
