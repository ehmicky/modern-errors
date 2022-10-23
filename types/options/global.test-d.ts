import { expectAssignable, expectNotAssignable } from 'tsd'

import { GlobalOptions } from '../main.js'

expectAssignable<GlobalOptions>({})
expectNotAssignable<GlobalOptions>(true)
