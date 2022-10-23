import { expectAssignable, expectNotAssignable } from 'tsd'

import { ClassOptions } from '../main.js'

expectAssignable<ClassOptions>({})
expectNotAssignable<ClassOptions>(true)
