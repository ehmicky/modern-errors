import { expectAssignable, expectNotAssignable } from 'tsd'

import { ClassOptions, InstanceOptions } from 'modern-errors'

expectAssignable<InstanceOptions>({ cause: '' })
expectNotAssignable<ClassOptions>({ cause: '' })

expectAssignable<InstanceOptions>({ errors: [''] })
expectNotAssignable<ClassOptions>({ errors: [''] })
expectNotAssignable<InstanceOptions>({ errors: '' })
