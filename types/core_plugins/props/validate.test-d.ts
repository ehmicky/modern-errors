import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import modernErrors, {
  ClassOptions,
  InstanceOptions,
  GlobalOptions,
} from '../../main.js'

const AnyError = modernErrors()
const SError = AnyError.subclass('SError')

modernErrors([], { props: {} })
AnyError.subclass('TestError', { props: {} })
SError.subclass('TestError', { props: {} })
new AnyError('', { cause: '', props: {} })
new SError('', { props: {} })
expectAssignable<GlobalOptions>({ props: {} })
expectAssignable<ClassOptions>({ props: {} })
expectAssignable<InstanceOptions>({ props: {} })

expectError(modernErrors([], { props: true }))
expectError(AnyError.subclass('TestError', { props: true }))
expectError(SError.subclass('TestError', { props: true }))
expectError(new AnyError('', { cause: '', props: true }))
expectError(new SError('', { props: true }))
expectNotAssignable<GlobalOptions>({ props: true })
expectNotAssignable<ClassOptions>({ props: true })
expectNotAssignable<InstanceOptions>({ props: true })
