import { expectError } from 'tsd'

import modernErrors from '../main.js'

const AnyError = modernErrors()

const SError = AnyError.subclass('SError')
expectError(SError.normalize(''))

const SSError = SError.subclass('SSError')
expectError(SSError.normalize(''))
