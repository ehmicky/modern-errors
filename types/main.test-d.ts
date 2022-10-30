import { expectType, expectAssignable, expectError } from 'tsd'

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
import './subclass/main/class.test-d.js'
import './subclass/main/plugins.test-d.js'
import './subclass/name.test-d.js'
import './subclass/parent.test-d.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const CError = AnyError.subclass('CError')
const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const sError = new SError('')
const ssError = new SSError('')

expectAssignable<Error>({} as ErrorInstance)
expectType<ErrorInstance>({} as InstanceType<ErrorClass>)

const anyError = new AnyError('', { cause: sError })
expectType<typeof sError>(anyError)

modernErrors([])
modernErrors([], {})
modernErrors([{ name: 'test' as const }], {})
expectError(modernErrors(true))

const exception = {} as unknown
if (exception instanceof AnyError) {
  expectType<AnyInstance>(exception)
}
if (exception instanceof SError) {
  expectType<typeof SError['prototype']>(exception)
}
if (exception instanceof SSError) {
  expectType<typeof SSError['prototype']>(exception)
}
if (sError instanceof CError) {
  expectType<never>(sError)
}
if (ssError instanceof CError) {
  expectType<never>(ssError)
}
if (sError instanceof SError) {
  expectType<typeof sError>(sError)
}
if (ssError instanceof SSError) {
  expectType<typeof ssError>(ssError)
}
if (sError instanceof AnyError) {
  expectType<typeof sError>(sError)
}
if (ssError instanceof AnyError) {
  expectType<typeof ssError>(ssError)
}
if (sError instanceof Error) {
  expectType<typeof sError>(sError)
}
if (ssError instanceof Error) {
  expectType<typeof ssError>(ssError)
}
