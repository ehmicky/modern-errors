import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { InstanceOptions } from '../main.js'

const AnyError = modernErrors()

expectAssignable<InstanceOptions>({})
expectNotAssignable<InstanceOptions>(true)

expectNotAssignable<InstanceOptions>({ custom: AnyError })
