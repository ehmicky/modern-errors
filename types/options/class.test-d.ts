import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrors, { ClassOptions } from '../main.js'

const AnyError = modernErrors()

expectAssignable<ClassOptions>({})
expectNotAssignable<ClassOptions>(true)

expectAssignable<ClassOptions>({ custom: AnyError })
