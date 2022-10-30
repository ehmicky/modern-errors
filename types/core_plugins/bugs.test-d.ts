import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'
import plugin from './bugs.js'

const AnyError = modernErrors([plugin])
const error = new AnyError('', { cause: '' })

modernErrors([plugin], { bugs: 'https://example.com' })
expectError(modernErrors([plugin], { bugs: true }))

expectType<string>(error.message)
