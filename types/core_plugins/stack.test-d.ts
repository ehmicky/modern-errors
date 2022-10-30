import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'
import plugin from './stack.js'

const AnyError = modernErrors([plugin])
expectError(modernErrors([plugin], { stack: undefined }))

expectType<string>(new AnyError('', { cause: '' }).stack)
