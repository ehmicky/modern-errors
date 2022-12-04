import type { ClassOptions, InstanceOptions } from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

expectAssignable<InstanceOptions>({})

expectAssignable<InstanceOptions>({ cause: new Error('') })
expectAssignable<InstanceOptions>({ cause: '' })
expectAssignable<InstanceOptions>({ cause: undefined })
expectNotAssignable<ClassOptions>({ cause: '' })

expectAssignable<InstanceOptions>({ errors: [new Error('')] as const })
expectAssignable<InstanceOptions>({ errors: [''] })
expectAssignable<InstanceOptions>({ errors: [undefined] })
expectAssignable<InstanceOptions>({ errors: undefined })
expectNotAssignable<ClassOptions>({ errors: [''] })
expectNotAssignable<InstanceOptions>({ errors: '' })
