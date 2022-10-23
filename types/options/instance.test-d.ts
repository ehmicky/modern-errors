import { expectNotAssignable } from 'tsd'

import modernErrors, { InstanceOptions } from '../main.js'

const AnyError = modernErrors()

expectNotAssignable<InstanceOptions>({ custom: AnyError })
