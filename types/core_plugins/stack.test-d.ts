import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'
import plugin from './serialize.js'

const AnyError = modernErrors([plugin])
expectError(modernErrors([plugin], { stack: undefined }))

expectType<string | undefined>(new AnyError('', { cause: '' }).stack)
