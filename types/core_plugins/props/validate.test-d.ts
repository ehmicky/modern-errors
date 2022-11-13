import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, { ClassOptions, InstanceOptions } from 'modern-errors'

const BaseError = modernErrors()
const ChildError = BaseError.subclass('ChildError')

modernErrors([], { props: {} })
BaseError.subclass('TestError', { props: {} })
ChildError.subclass('TestError', { props: {} })
new BaseError('', { cause: '', props: {} })
new ChildError('', { props: {} })
expectAssignable<ClassOptions>({ props: {} })
expectAssignable<InstanceOptions>({ props: {} })

expectError(modernErrors([], { props: true }))
expectError(BaseError.subclass('TestError', { props: true }))
expectError(ChildError.subclass('TestError', { props: true }))
expectError(new BaseError('', { cause: '', props: true }))
expectError(new ChildError('', { props: true }))
expectNotAssignable<ClassOptions>({ props: true })
expectNotAssignable<InstanceOptions>({ props: true })
