import { expectNotAssignable } from 'tsd'

import modernErrors, { GlobalOptions } from '../main.js'

const AnyError = modernErrors()

expectNotAssignable<GlobalOptions>({ custom: AnyError })
