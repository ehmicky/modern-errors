import { expectType, expectAssignable, expectError } from 'tsd'
import type { ErrorName } from 'error-custom-class'

import modernErrors, { ErrorClass, ErrorInstance } from './main.js'

import './any/aggregate.test-d.js'
import './any/main.test-d.js'
import './any/modify.test-d.js'
import './any/normalize.test-d.js'
import './core_plugins/props.test-d.js'
import './options/class.test-d.js'
import './options/instance.test-d.js'
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
expectAssignable<ErrorInstance>(wideError)
expectAssignable<Error>(wideError)
expectType<ErrorName>(wideError.name)
expectAssignable<Error>({} as ErrorInstance)
expectType<ErrorInstance>({} as InstanceType<ErrorClass>)

const SError = AnyError.subclass('SError')
const sError = new SError('')
expectAssignable<typeof SError['prototype']>(sError)
expectAssignable<AnyInstance>(sError)
expectAssignable<ErrorInstance>(sError)
expectAssignable<Error>(sError)
expectType<'SError'>(sError.name)
if (exception instanceof SError) {
  expectType<typeof SError['prototype']>(exception)
}

const SSError = SError.subclass('SSError')
const ssError = new SSError('')
expectAssignable<typeof SSError['prototype']>(ssError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<ErrorInstance>(ssError)
expectAssignable<Error>(ssError)
expectType<'SSError'>(ssError.name)
if (exception instanceof SSError) {
  expectType<typeof SSError['prototype']>(exception)
}

const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {},
})
const cError = new CError('')
expectAssignable<typeof CError['prototype']>(cError)
expectAssignable<AnyInstance>(cError)
expectAssignable<ErrorInstance>(cError)
expectAssignable<Error>(cError)
expectType<'CError'>(cError.name)

const SCError = CError.subclass('SCError')
const scError = new SCError('')
expectAssignable<typeof SCError['prototype']>(scError)
expectAssignable<AnyInstance>(scError)
expectAssignable<ErrorInstance>(scError)
expectAssignable<Error>(scError)
expectType<'SCError'>(scError.name)

const CSError = SError.subclass('CSError', { custom: class extends SError {} })
const csError = new CSError('')
expectAssignable<typeof CSError['prototype']>(csError)
expectAssignable<AnyInstance>(csError)
expectAssignable<ErrorInstance>(csError)
expectAssignable<Error>(csError)
expectType<'CSError'>(csError.name)

const CCError = CError.subclass('CCError', { custom: class extends CError {} })
const ccError = new CCError('')
expectAssignable<typeof CCError['prototype']>(ccError)
expectAssignable<AnyInstance>(ccError)
expectAssignable<ErrorInstance>(ccError)
expectAssignable<Error>(ccError)
expectType<'CCError'>(ccError.name)

const anyError = new AnyError('', { cause: sError })
expectAssignable<typeof sError>(anyError)

modernErrors([])
modernErrors([], {})
modernErrors([{ name: 'test' as const }], {})
expectError(modernErrors(true))

if (exception instanceof AnyError) {
  expectAssignable<AnyInstance>(exception)
}
if (cError instanceof SError) {
  expectType<never>(cError)
}
if (cError instanceof CError) {
  expectAssignable<typeof cError>(cError)
}
if (cError instanceof AnyError) {
  expectAssignable<typeof cError>(cError)
}
if (cError instanceof Error) {
  expectAssignable<typeof cError>(cError)
}
