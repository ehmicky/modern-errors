import { expectType, expectError } from 'tsd'

import modernErrors from '../main.js'
import plugin from './process.js'

const AnyError = modernErrors([plugin])
const undo = AnyError.logProcess()

modernErrors([plugin], { process: {} })
AnyError.logProcess({})
modernErrors([plugin], { process: { exit: true } })
AnyError.logProcess({ exit: true })
expectError(AnyError.logProcess(undefined))
expectError(modernErrors([plugin], { process: true }))
expectError(AnyError.logProcess(true))
expectError(modernErrors([plugin], { process: { exit: 'true' } }))
expectError(AnyError.logProcess({ exit: 'true' }))

expectType<void>(undo())
expectError(undo(undefined))
