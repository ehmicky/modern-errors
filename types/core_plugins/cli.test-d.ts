import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors from '../main.js'
import plugin, { Options } from './cli.js'

const AnyError = modernErrors([plugin])
expectType<void>(AnyError.exit())

modernErrors([plugin], { cli: {} })
AnyError.exit({})
expectAssignable<Options>({})
expectError(AnyError.exit(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([plugin], { cli: true }))
expectError(AnyError.exit(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([plugin], { cli: { unknown: true } }))
expectError(AnyError.exit({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

modernErrors([plugin], { cli: { silent: true } })
AnyError.exit({ silent: true })
expectAssignable<Options>({ silent: true })
expectError(modernErrors([plugin], { cli: { silent: 'true' } }))
expectError(AnyError.exit({ silent: 'true' }))
expectNotAssignable<Options>({ silent: 'true' })
