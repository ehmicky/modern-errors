import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorClass } from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, staticMethods: { staticMethod() {} } }

type BareErrorClass = ErrorClass<[typeof barePlugin]>
type FullErrorClass = ErrorClass<[typeof fullPlugin]>

const BaseError = modernErrors({ plugins: [fullPlugin] })

expectAssignable<ErrorClass>(BaseError)
expectAssignable<BareErrorClass>(BaseError)
expectAssignable<FullErrorClass>(BaseError)

const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    prop = true
  },
})

expectAssignable<ErrorClass>(CustomError)
expectAssignable<BareErrorClass>(CustomError)
expectAssignable<FullErrorClass>(CustomError)

const WideError = modernErrors({ plugins: [{} as Plugin] })

expectAssignable<ErrorClass>(WideError)
expectAssignable<BareErrorClass>(WideError)
expectNotAssignable<FullErrorClass>(WideError)

const CustomWideError = WideError.subclass('CustomWideError', {
  custom: class extends WideError {
    prop = true
  },
})

expectAssignable<ErrorClass>(CustomWideError)
expectAssignable<BareErrorClass>(CustomWideError)
expectNotAssignable<FullErrorClass>(CustomWideError)
