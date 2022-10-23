import { expectAssignable, expectNotAssignable } from 'tsd'

import { InstanceOptions } from '../main.js'

expectAssignable<InstanceOptions>({})
expectNotAssignable<InstanceOptions>(true)
