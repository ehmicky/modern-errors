import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { GlobalOptions } from '../main.js'

const AnyError = modernErrors()

expectAssignable<GlobalOptions>({})
expectNotAssignable<GlobalOptions>(true)

expectNotAssignable<GlobalOptions>({ custom: AnyError })
