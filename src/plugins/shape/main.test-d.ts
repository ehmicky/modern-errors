import type { Plugin } from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

const name = 'test' as const
expectAssignable<Plugin>({ name })
expectNotAssignable<Plugin>({})
expectNotAssignable<Plugin>({ name, unknown: true })
