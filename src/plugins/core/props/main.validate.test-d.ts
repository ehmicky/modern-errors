import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError, { ClassOptions, InstanceOptions } from 'modern-errors'

ModernError.subclass('TestError', { props: {} })
new ModernError('', { props: {} })
expectAssignable<ClassOptions>({ props: {} })
expectAssignable<InstanceOptions>({ props: {} })

ModernError.subclass('TestError', { props: { prop: true } })
new ModernError('', { props: { prop: true } })
expectAssignable<ClassOptions>({ props: { prop: true } })
expectAssignable<InstanceOptions>({ props: { prop: true } })

expectError(ModernError.subclass('TestError', { props: true }))
expectError(new ModernError('', { props: true }))
expectNotAssignable<ClassOptions>({ props: true })
expectNotAssignable<InstanceOptions>({ props: true })
