import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorInstance } from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, instanceMethods: { instanceMethod() {} } }

type BareErrorInstance = ErrorInstance<[typeof barePlugin]>
type FullErrorInstance = ErrorInstance<[typeof fullPlugin]>

const BaseError = modernErrors([fullPlugin])
const unknownError = new BaseError('', { cause: '' })

expectAssignable<Error>(unknownError)
expectAssignable<ErrorInstance>(unknownError)
expectAssignable<BareErrorInstance>(unknownError)
expectAssignable<FullErrorInstance>(unknownError)

const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    prop = true
  },
})
const customError = new CustomError('')

expectAssignable<Error>(customError)
expectAssignable<ErrorInstance>(customError)
expectAssignable<BareErrorInstance>(customError)
expectAssignable<FullErrorInstance>(customError)

const WideError = modernErrors([{} as Plugin])
const wideError = new WideError('', { cause: '' })
type WideErrorInstance = InstanceType<typeof WideError>

expectType<Error>(wideError)
expectAssignable<ErrorInstance>(wideError)
expectAssignable<BareErrorInstance>(wideError)
expectNotAssignable<FullErrorInstance>(wideError)
expectType<WideErrorInstance>(wideError)

const exception = {} as unknown
if (exception instanceof WideError) {
  expectType<WideErrorInstance>(exception)
}

const CustomWideError = WideError.subclass('CustomWideError', {
  custom: class extends WideError {
    prop = true
  },
})
const customWideError = new CustomWideError('')
type CustomWideErrorInstance = InstanceType<typeof CustomWideError>

expectAssignable<Error>(customWideError)
expectAssignable<ErrorInstance>(customWideError)
expectAssignable<BareErrorInstance>(customWideError)
expectNotAssignable<FullErrorInstance>(customWideError)
expectAssignable<WideErrorInstance>(customWideError)
expectType<CustomWideErrorInstance>(customWideError)

// TODO: fix
// if (exception instanceof CustomWideError) {
//   expectType<CustomWideErrorInstance>(exception)
// }