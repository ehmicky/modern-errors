import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors from '../main.js'
import plugin, { Options, Event } from './process.js'

const AnyError = modernErrors([plugin])
const undo = AnyError.logProcess()

modernErrors([plugin], { process: {} })
AnyError.logProcess({})
expectAssignable<Options>({})
modernErrors([plugin], { process: { exit: true } })
AnyError.logProcess({ exit: true })
expectAssignable<Options>({ exit: true })
expectError(AnyError.logProcess(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([plugin], { process: true }))
expectError(AnyError.logProcess(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([plugin], { process: { exit: 'true' } }))
expectError(AnyError.logProcess({ exit: 'true' }))
expectNotAssignable<Options>({ exit: 'true' })
expectError(modernErrors([plugin], { process: { unknown: true } }))
expectError(AnyError.logProcess({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

expectAssignable<Event>('rejectionHandled')
expectNotAssignable<Event>('')

expectType<void>(undo())
expectError(undo(undefined))
