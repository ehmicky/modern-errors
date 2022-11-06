import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, BaseErrorClass } from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, staticMethods: { staticMethod() {} } }

type BareBaseErrorClass = BaseErrorClass<[typeof barePlugin]>
type FullBaseErrorClass = BaseErrorClass<[typeof fullPlugin]>

const BaseError = modernErrors([fullPlugin])

expectAssignable<BaseErrorClass>(BaseError)
expectAssignable<BareBaseErrorClass>(BaseError)
expectAssignable<FullBaseErrorClass>(BaseError)

const CustomError = BaseError.subclass('CustomError', {
  custom: class extends BaseError {
    prop = true
  },
})

expectNotAssignable<BaseErrorClass>(CustomError)
expectNotAssignable<BareBaseErrorClass>(CustomError)
expectNotAssignable<FullBaseErrorClass>(CustomError)

const WideError = modernErrors([{} as Plugin])

expectAssignable<BaseErrorClass>(WideError)
expectAssignable<BareBaseErrorClass>(WideError)
expectNotAssignable<FullBaseErrorClass>(WideError)

const CustomWideError = WideError.subclass('CustomWideError', {
  custom: class extends WideError {
    prop = true
  },
})

expectNotAssignable<BaseErrorClass>(CustomWideError)
expectNotAssignable<BareBaseErrorClass>(CustomWideError)
expectNotAssignable<FullBaseErrorClass>(CustomWideError)
