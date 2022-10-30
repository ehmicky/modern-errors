import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { Plugin, ErrorClass } from '../../main.js'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, instanceMethods: { instanceMethod() {} } }

type BareErrorClass = ErrorClass<[typeof barePlugin]>
type FullErrorClass = ErrorClass<[typeof fullPlugin]>

const AnyError = modernErrors([fullPlugin])

expectAssignable<ErrorClass>(AnyError)
expectAssignable<BareErrorClass>(AnyError)
expectAssignable<FullErrorClass>(AnyError)

const ChildError = AnyError.subclass('ChildError')

expectAssignable<ErrorClass>(ChildError)
expectAssignable<BareErrorClass>(ChildError)
expectAssignable<FullErrorClass>(ChildError)

const WideAnyError = modernErrors([{} as Plugin])

expectAssignable<ErrorClass>(WideAnyError)
expectAssignable<BareErrorClass>(WideAnyError)
expectNotAssignable<FullErrorClass>(WideAnyError)

const WideError = WideAnyError.subclass('WideError')

expectAssignable<ErrorClass>(WideError)
expectAssignable<BareErrorClass>(WideError)
expectNotAssignable<FullErrorClass>(WideError)
