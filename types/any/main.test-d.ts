import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, AnyErrorClass } from '../main.js'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, staticMethods: { staticMethod() {} } }

type BareAnyErrorClass = AnyErrorClass<[typeof barePlugin]>
type FullAnyErrorClass = AnyErrorClass<[typeof fullPlugin]>

const AnyError = modernErrors([fullPlugin])

expectAssignable<AnyErrorClass>(AnyError)
expectAssignable<BareAnyErrorClass>(AnyError)
expectAssignable<FullAnyErrorClass>(AnyError)

const CustomError = AnyError.subclass('CustomError', {
  custom: class extends AnyError {
    prop = true
  },
})

expectNotAssignable<AnyErrorClass>(CustomError)
expectNotAssignable<BareAnyErrorClass>(CustomError)
expectNotAssignable<FullAnyErrorClass>(CustomError)

const WideError = modernErrors([{} as Plugin])

expectAssignable<AnyErrorClass>(WideError)
expectAssignable<BareAnyErrorClass>(WideError)
expectNotAssignable<FullAnyErrorClass>(WideError)

const CustomWideError = WideError.subclass('CustomWideError', {
  custom: class extends WideError {
    prop = true
  },
})

expectNotAssignable<AnyErrorClass>(CustomWideError)
expectNotAssignable<BareAnyErrorClass>(CustomWideError)
expectNotAssignable<FullAnyErrorClass>(CustomWideError)
