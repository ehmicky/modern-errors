import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'
import plugin from './process.js'

const AnyError = modernErrors([plugin])

modernErrors([plugin], { process: {} })
modernErrors([plugin], { process: { exit: true } })
expectError(modernErrors([plugin], { process: true }))
expectError(modernErrors([plugin], { process: { exit: 'true' } }))

const undo = AnyError.logProcess()
expectType<void>(undo())
expectError(AnyError.logProcess(undefined))
