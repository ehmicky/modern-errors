import { expectAssignable, expectNotAssignable } from 'tsd'

import { ClassOptions, InstanceOptions, GlobalOptions } from '../main.js'

expectAssignable<InstanceOptions>({ cause: '' })
expectNotAssignable<GlobalOptions>({ cause: '' })
expectNotAssignable<ClassOptions>({ cause: '' })

expectAssignable<InstanceOptions>({ errors: [''] })
expectNotAssignable<ClassOptions>({ errors: [''] })
expectNotAssignable<GlobalOptions>({ errors: [''] })
expectNotAssignable<InstanceOptions>({ errors: '' })