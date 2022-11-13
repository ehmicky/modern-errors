import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError, { ClassOptions, InstanceOptions } from 'modern-errors'

const ChildError = ModernError.subclass('ChildError')

ModernError.subclass('TestError', { props: {} })
ChildError.subclass('TestError', { props: {} })
new ModernError('', { props: {} })
new ChildError('', { props: {} })
expectAssignable<ClassOptions>({ props: {} })
expectAssignable<InstanceOptions>({ props: {} })

expectError(ModernError.subclass('TestError', { props: true }))
expectError(ChildError.subclass('TestError', { props: true }))
expectError(new ModernError('', { props: true }))
expectError(new ChildError('', { props: true }))
expectNotAssignable<ClassOptions>({ props: true })
expectNotAssignable<InstanceOptions>({ props: true })
