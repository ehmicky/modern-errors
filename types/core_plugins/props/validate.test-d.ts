import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  ClassOptions,
  InstanceOptions,
  GlobalOptions,
} from 'modern-errors'

const AnyError = modernErrors()
const ChildError = AnyError.subclass('ChildError')

modernErrors([], { props: {} })
AnyError.subclass('TestError', { props: {} })
ChildError.subclass('TestError', { props: {} })
new AnyError('', { cause: '', props: {} })
new ChildError('', { props: {} })
expectAssignable<GlobalOptions>({ props: {} })
expectAssignable<ClassOptions>({ props: {} })
expectAssignable<InstanceOptions>({ props: {} })

expectError(modernErrors([], { props: true }))
expectError(AnyError.subclass('TestError', { props: true }))
expectError(ChildError.subclass('TestError', { props: true }))
expectError(new AnyError('', { cause: '', props: true }))
expectError(new ChildError('', { props: true }))
expectNotAssignable<GlobalOptions>({ props: true })
expectNotAssignable<ClassOptions>({ props: true })
expectNotAssignable<InstanceOptions>({ props: true })
