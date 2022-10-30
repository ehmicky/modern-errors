import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'
import plugin from './stack.js'

const AnyError = modernErrors([plugin])
const error = new AnyError('', { cause: '' })

expectError(modernErrors([plugin], { stack: undefined }))

expectType<string | undefined>(error.stack)
