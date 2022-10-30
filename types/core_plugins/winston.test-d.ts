import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import { createLogger } from 'winston'

import modernErrors from '../main.js'
import plugin, { Options, Format } from './winston.js'

const AnyError = modernErrors([plugin])
const fullFormat = AnyError.fullFormat()
const shortFormat = AnyError.shortFormat()

modernErrors([plugin], { winston: {} })
AnyError.fullFormat({})
AnyError.shortFormat({})
expectAssignable<Options>({})
expectError(AnyError.fullFormat(undefined))
expectError(AnyError.shortFormat(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([plugin], { winston: true }))
expectError(AnyError.fullFormat(true))
expectError(AnyError.shortFormat(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([plugin], { winston: { unknown: true } }))
expectError(AnyError.fullFormat({ unknown: true }))
expectError(AnyError.shortFormat({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

modernErrors([plugin], { winston: { level: 'error' } })
AnyError.fullFormat({ level: 'error' })
AnyError.shortFormat({ level: 'error' })
expectAssignable<Options>({ level: 'error' })
expectError(modernErrors([plugin], { winston: { level: true } }))
expectError(AnyError.fullFormat({ level: true }))
expectError(AnyError.shortFormat({ level: true }))
expectNotAssignable<Options>({ level: true })

modernErrors([plugin], { winston: { stack: true } })
AnyError.fullFormat({ stack: true })
AnyError.shortFormat({ stack: true })
expectAssignable<Options>({ stack: true })
expectError(modernErrors([plugin], { winston: { stack: 'true' } }))
expectError(AnyError.fullFormat({ stack: 'true' }))
expectError(AnyError.shortFormat({ stack: 'true' }))
expectNotAssignable<Options>({ stack: 'true' })

expectType<Format>(fullFormat)
expectType<Format>(shortFormat)

createLogger({ format: fullFormat })
createLogger({ format: shortFormat })
