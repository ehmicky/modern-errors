import { expectType } from 'tsd'

import modernErrors from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {
    prop = true as const
  },
})
const SError = AnyError.subclass('SError', {
  custom: class extends AnyError {
    prop = false as const
  },
})
const SSError = SError.subclass('SSError')
const unknownError = new AnyError('', { cause: '' })
const sError = new SError('')
const ssError = new SSError('')

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
if (unknownError instanceof AnyError) {
  expectType<typeof unknownError>(unknownError)
}
if (sError instanceof Error) {
  expectType<typeof sError>(sError)
}
if (ssError instanceof Error) {
  expectType<typeof ssError>(ssError)
}
